import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

const API_BASE_URL = "https://asyllabic-emelina-uncheated.ngrok-free.dev/api";

function ScanQRCode() {
  const [status, setStatus] = useState("Vui lòng cấp quyền Camera...");
  const [scanResult, setScanResult] = useState("");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [attendedCourse, setAttendedCourse] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const lastScannedRef = useRef("");
  const scannerRef = useRef(null);
  const token =
    localStorage.getItem("token") || localStorage.getItem("user_token");

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length > 0) {
          setCameras(devices);
          const backCam = devices.find((d) =>
            d.label.toLowerCase().includes("back"),
          );
          setSelectedCamera(backCam ? backCam.id : devices[0].id);
          setStatus("Sẵn sàng quét!");
        }
      } catch (err) {
        setError("Chưa cấp quyền Camera!");
      }
    };
    getCameras();
    return () => stopScanning();
  }, []);

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        // Chỉ stop khi trạng thái là đang quét (2) hoặc đang chờ (1)
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } catch (err) {
        console.warn("Dừng scanner thất bại:", err);
      }
    }
    setIsScanning(false);
  };

  const startScanning = async () => {
    if (!selectedCamera) return;
    setError("");
    setScanResult("");
    setAttendanceMessage("");
    setAttendedCourse("");

    // Tạo instance mới mỗi lần bật
    scannerRef.current = new Html5Qrcode("reader");

    try {
      await scannerRef.current.start(
        selectedCamera,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (decodedText !== lastScannedRef.current) {
            lastScannedRef.current = decodedText;
            setScanResult(decodedText);
            stopScanning(); // Dừng cam ngay
            submitAttendance(decodedText); // Gửi API
          }
        },
      );
      setIsScanning(true);
      setStatus("Đang quét...");
    } catch (err) {
      setError("Không thể bật camera.");
    }
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        () => resolve({ latitude: null, longitude: null }), // Vẫn cho điểm danh nếu lỗi GPS
        { timeout: 5000 },
      );
    });
  };

  const submitAttendance = async (decoded) => {
    console.log("Dữ liệu thô từ QR:", decoded);
    setIsSubmitting(true);
    setError("");
    try {
      const coords = await getLocation();

      // SỬA ĐOẠN NÀY ĐỂ TÁCH MÃ CHUẨN
      const parts = decoded.split("-");
      if (parts.length < 2) throw new Error("Mã QR sai định dạng!");

      const sessionId = parts[0]; // Lấy số 1
      const qrToken = parts.slice(1).join("-"); // Lấy chuỗi BaznRyCR...

      console.log("SessionID tách được:", sessionId);
      console.log("Token tách được:", qrToken);

      const res = await axios.post(
        `${API_BASE_URL}/attendance`,
        {
          session_id: sessionId,
          qr_token: qrToken, // Bây giờ sẽ chỉ gửi chuỗi sạch
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      setAttendanceMessage(`✅ ${res.data.message}`);
      setAttendedCourse(res.data.course_name);
      setStatus("Hoàn tất!");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi gửi dữ liệu");
      lastScannedRef.current = ""; // Cho phép quét lại
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-800 mb-2">
          Quét mã điểm danh
        </h1>
        {attendedCourse && (
          <div className="bg-green-50 text-green-700 p-3 rounded-xl font-bold border border-green-100 ">
            📖 Môn học: {attendedCourse}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <div
              id="reader"
              className="overflow-hidden rounded-2xl bg-black min-h-[300px]"
            ></div>
            <div className="flex gap-2">
              <select
                className="flex-1 p-2 bg-gray-50 border rounded-lg font-bold"
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                {cameras.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <button
                onClick={isScanning ? stopScanning : startScanning}
                className={`px-6 py-2 rounded-lg font-bold text-white ${isScanning ? "bg-red-500" : "bg-indigo-600"}`}
              >
                {isScanning ? "TẮT CAM" : "BẬT CAM"}
              </button>
            </div>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border border-dashed">
            <h3 className="font-bold text-gray-400 uppercase text-xs">
              Kết quả
            </h3>
            <p className="text-sm font-medium text-gray-600">
              Trạng thái:{" "}
              <span className="text-indigo-600 font-bold">{status}</span>
            </p>
            {attendanceMessage && (
              <p className="text-green-600 font-black">{attendanceMessage}</p>
            )}
            {error && <p className="text-red-500 font-bold">⚠️ {error}</p>}

            <div className="pt-4 border-t">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                Nhập mã thủ công
              </p>
              <textarea
                className="w-full p-3 text-sm rounded-xl border"
                rows="3"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Dán mã vào đây..."
              ></textarea>
              <button
                onClick={() => submitAttendance(manualInput)}
                disabled={!manualInput}
                className="w-full mt-2 bg-gray-800 text-white py-2 rounded-lg font-bold disabled:opacity-50"
              >
                GỬI MÃ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanQRCode;
