import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function ScanQRCode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanResultRef = useRef("");
  const [status, setStatus] = useState("Khởi tạo camera...");
  const [scanResult, setScanResult] = useState("");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const token = localStorage.getItem("token") || localStorage.getItem("user_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error("Trình duyệt không hỗ trợ định vị GPS."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        () => {
          reject(new Error("Không lấy được tọa độ GPS. Vui lòng cho phép định vị."));
        },
        { enableHighAccuracy: true, timeout: 12000 }
      );
    });
  };

  const submitAttendance = async (decoded) => {
    if (!decoded) return;
    setIsSubmitting(true);
    setAttendanceMessage("");
    setError("");

    try {
      const coords = await getLocation();
      const payload = {
        student_id: user.id,
        qr_data: decoded,
        datetime: new Date().toISOString(),
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
      };

      await axios.post(`${API_BASE_URL}/attendance/scan`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAttendanceMessage("Đã gửi điểm danh thành công cùng GPS.");
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Không thể gửi điểm danh."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let animationId;
    let stream;
    let detector;

    const scanFrame = async () => {
      if (!videoRef.current || videoRef.current.readyState !== 4) {
        animationId = requestAnimationFrame(scanFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const barcodes = await detector.detect(canvas);
        if (barcodes && barcodes.length > 0) {
          const decodedText = barcodes[0].rawValue;
          if (decodedText !== scanResultRef.current) {
            scanResultRef.current = decodedText;
            setScanResult(decodedText);
            setStatus("Đã quét mã QR thành công.");
            submitAttendance(decodedText);
          }
        }
      } catch (err) {
        if (videoRef.current && videoRef.current.readyState === 4) {
          setError("Không đọc được mã QR. Hãy thử lại hoặc dùng trình duyệt khác.");
        }
      }

      animationId = requestAnimationFrame(scanFrame);
    };

    const initScanner = async () => {
      if (!("BarcodeDetector" in window)) {
        setStatus("Trình duyệt hiện tại chưa hỗ trợ đọc QR trực tiếp.");
        setError("Vui lòng dùng Chrome hoặc Edge mới nhất.");
        return;
      }

      const supportedFormats = await window.BarcodeDetector.getSupportedFormats();
      if (!supportedFormats.includes("qr_code")) {
        setStatus("BarcodeDetector chưa hỗ trợ QR code trên trình duyệt này.");
        setError("Vui lòng dùng Chrome hoặc Edge mới nhất.");
        return;
      }

      detector = new window.BarcodeDetector({ formats: ["qr_code"] });

      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("Camera đã sẵn sàng. Hướng vào mã QR để quét.");
        scanFrame();
      } catch (err) {
        setError("Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.");
        setStatus("Camera không khả dụng.");
      }
    };

    initScanner();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) return;
    setScanResult(manualInput.trim());
    setStatus("Đang gửi dữ liệu mã QR thủ công...");
    await submitAttendance(manualInput.trim());
  };

  return (
    <div className="space-y-8 py-10 min-h-[70vh]">
      <div className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl shadow-gray-200/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-600 font-bold">Quét QR điểm danh</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3">Mở camera, quét mã và gửi điểm danh</h1>
            <p className="mt-4 max-w-2xl text-gray-500 leading-relaxed">
              Camera quét mã QR được tích hợp trực tiếp. Sau khi giải mã, hệ thống sẽ lấy tọa độ GPS từ trình duyệt và gửi kèm API điểm danh.
            </p>
          </div>
          <div className="rounded-3xl bg-indigo-600 px-6 py-5 text-white shadow-lg shadow-indigo-200/30">
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-100">Trạng thái</p>
            <p className="mt-3 text-3xl font-black">{status}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera quét QR</h2>
          <div className="overflow-hidden rounded-3xl border border-dashed border-gray-200 bg-black/5">
            <video ref={videoRef} className="w-full min-h-[320px] bg-black" playsInline muted />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Kết quả quét</p>
              <p className="mt-2 font-bold text-gray-900 break-all">{scanResult || "Chưa có dữ liệu"}</p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Thông báo gửi</p>
              <p className="mt-2 font-semibold text-gray-900">{attendanceMessage || "Chưa gửi"}</p>
            </div>
          </div>
          {error && (
            <div className="mt-5 rounded-3xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Nếu camera không hoạt động</h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            Bạn cũng có thể dán nội dung mã QR thủ công nếu trình duyệt chưa hỗ trợ quét mã QR trực tiếp.
          </p>
          <textarea
            rows={5}
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Dán dữ liệu mã QR vào đây"
            className="w-full rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm outline-none focus:border-indigo-500"
          />
          <button
            disabled={isSubmitting}
            onClick={handleManualSubmit}
            className="mt-4 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-white font-bold transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Gửi thủ công
          </button>
          <div className="mt-6 rounded-3xl bg-indigo-50 p-4 text-sm text-indigo-700">
            <p className="font-semibold">Lưu ý</p>
            <p className="mt-2 text-gray-600">
              Nếu trình duyệt không hỗ trợ `BarcodeDetector`, hãy chuyển sang Chrome/Edge mới nhất và bật quyền camera.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanQRCode;
