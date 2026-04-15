<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize; // Thêm dòng này

class AttendanceExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $sessionId;

    public function __construct($sessionId) {
        $this->sessionId = $sessionId;
    }

    // Lấy dữ liệu từ DB kèm thông tin SV
    public function query() {
        return Attendance::where('session_id', $this->sessionId)->with('student');
    }

    // Tiêu đề cột
    public function headings(): array {
        return ["Mã SV", "Họ Tên", "Thời gian quét", "Trạng thái", "Tọa độ"];
    }

    // Đổ dữ liệu vào cột tương ứng
    public function map($attendance): array {
        return [
            $attendance->student->student_code ?? 'N/A',
            $attendance->student->full_name ?? 'N/A',
            $attendance->checkin_time,
            $attendance->status,
            $attendance->latitude . ',' . $attendance->longitude,
        ];
    }
}