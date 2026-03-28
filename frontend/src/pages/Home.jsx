import React from "react";

function HomePage() {
  return (
    <div className="p-8 text-center">
      <div className="mt-8 flex justify-center gap-4">
        <div className="p-6 border rounded-lg shadow-sm w-64">
          <h3 className="font-bold">Sinh Viên</h3>
          <p>Quản lý danh sách và thông tin sinh viên.</p>
        </div>
        <div className="p-6 border rounded-lg shadow-sm w-64">
          <h3 className="font-bold">Điểm Danh</h3>
          <p>Quét mã QR để ghi nhận hiện diện.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
