import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Html5Qrcode } from "html5-qrcode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

function ScanQRCode() {
  const scanResultRef = useRef("");
  const [status, setStatus] = useState("Khởi tạo camera...");
  const [scanResult, setScanResult] = useState("");
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [manualInput, setManualInput] = useState("");
  
  // State mới quản lý trạng thái quét: 'idle' | 'success' | 'error'
  const [scanStatus, setScanStatus] = useState("idle");

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
        (err) => {
          console.error("Lỗi GPS:", err);
          reject(new Error("Không lấy được tọa độ GPS. Vui lòng bật vị trí trên điện thoại."));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const submitAttendance = async (decodedText) => {
    if (!decodedText) return;
    setIsSubmitting(true);
    setAttendanceMessage("");
    setError("");

    try {
      setStatus("Đang xử lý dữ liệu...");
      
      // 1. Phân tích mã QR để lấy ra session_id do Giảng viên tạo
      let sessionId = "";
      try {
          const parsed = JSON.parse(decodedText);
          sessionId = parsed.session_id; // Lấy session_id từ JSON
      } catch(e) {
          // Nếu mã quét thủ công không phải JSON thì lấy thẳng chuỗi gốc
          sessionId = decodedText; 
      }

      const coords = await getLocation();
      
      setStatus("Đang gửi lên Server...");
      
      // 2. Gói dữ liệu đúng chuẩn Backend yêu cầu
      const payload = {
        session_id: sessionId,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      // 3. Đổi route gọi API thành /attendance (Bỏ chữ /scan đi)
      await axios.post(`${API_BASE_URL}/attendance`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // --- NẾU THÀNH CÔNG ---
      setStatus("Điểm danh hoàn tất!");
      setScanStatus("success"); 
      setAttendanceMessage("Điểm danh thành công!");
      
      setTimeout(() => {
        setScanStatus("idle");
        scanResultRef.current = ""; 
      }, 3000);

    } catch (err) {
      // --- NẾU LỖI HOẶC QUÁ HẠN ---
      setStatus("Điểm danh thất bại.");
      setScanStatus("error"); 
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }

      // Backend trả về message lỗi cụ thể (VD: "Buổi học đã kết thúc", "Bạn đã điểm danh rồi")
      const apiErrorMsg = err.response?.data?.message;
      setError(apiErrorMsg || "Mã không hợp lệ hoặc đã quá hạn sử dụng.");
      
      setTimeout(() => {
        setScanStatus("idle");
        scanResultRef.current = ""; 
      }, 3000);

    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let html5QrCode = null;

    const readerElement = document.getElementById("reader");
    if (readerElement) {
      readerElement.innerHTML = "";
    }

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
          { facingMode: "environment" }, 
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (decodedText !== scanResultRef.current) {
              // Rung nhẹ khi vừa bắt được mã
              if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(100);
              }
              
              // Chuyển viền sang xanh lá tạm thời để báo hiệu đã đọc được mã
              setScanStatus("success");

              scanResultRef.current = decodedText;
              setScanResult(decodedText);
              submitAttendance(decodedText);
            }
          },
          (errorMessage) => {
            // Đang tìm mã... (bỏ qua)
          }
        );
        
        if (isMounted) {
          setStatus("Camera đã sẵn sàng. Hướng vào mã QR để quét.");
          setError(""); 
        }
      } catch (err) {
        if (isMounted) {
          setError("Không thể mở camera. Vui lòng kiểm tra quyền hoặc tải lại trang.");
          setStatus("Camera không khả dụng.");
        }
      }
    };

    const timerId = setTimeout(() => {
      if (isMounted) startScanner();
    }, 200);

    return () => {
      isMounted = false; 
      clearTimeout(timerId); 

      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().then(() => {
          html5QrCode.clear();
        }).catch((err) => console.error("Lỗi tắt cam:", err));
      }
    };
  }, []);

  const handleManualSubmit = async () => {
    if (!manualInput.trim()) return;
    setScanStatus("success"); // Đổi màu viền khi bấm gửi
    setScanResult(manualInput.trim());
    await submitAttendance(manualInput.trim());
  };

  // Xác định class CSS cho khung viền dựa vào state
  let borderClass = "border-gray-300 border-dashed";
  if (scanStatus === "success") borderClass = "border-green-500 border-solid shadow-[0_0_20px_rgba(34,197,94,0.5)]";
  if (scanStatus === "error") borderClass = "border-red-500 border-solid shadow-[0_0_20px_rgba(239,68,68,0.5)]";

  // Xác định class CSS cho màu chữ kết quả
  let textClass = "text-gray-900";
  if (scanStatus === "success") textClass = "text-green-600";
  if (scanStatus === "error") textClass = "text-red-600";

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
            <p className="mt-3 text-2xl font-black">{status}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Camera quét QR</h2>
          
          {/* Khung Camera với viền đổi màu động */}
          <div className={`overflow-hidden rounded-2xl border-[3px] relative bg-black flex justify-center items-center transition-all duration-300 ${borderClass}`}>
            <div id="reader" className="w-full"></div>
          </div>
          
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Kết quả quét</p>
              <p className={`mt-2 font-bold break-all transition-colors duration-300 ${textClass}`}>
                {scanResult || "Chưa có dữ liệu"}
              </p>
            </div>
            <div className="rounded-3xl bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Thông báo gửi</p>
              <p className={`mt-2 font-semibold transition-colors duration-300 ${scanStatus === 'error' ? 'text-red-600' : 'text-gray-900'}`}>
                {attendanceMessage || (scanStatus === 'error' ? 'Gửi thất bại' : 'Chưa gửi')}
              </p>
            </div>
          </div>
          {error && (
            <div className="mt-5 rounded-3xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
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
        </div>
      </div>
    </div>
  );
}

export default ScanQRCode;