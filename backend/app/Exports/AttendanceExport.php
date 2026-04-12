<?php

namespace App\Exports;

use App\Models\Attendance;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class AttendanceExport implements FromQuery, WithHeadings, WithMapping
{
    protected $sessionId;

    public function __construct($sessionId) {
        $this->sessionId = $sessionId;
    }

    // Lấy dữ liệu từ DB
    public function query() {
        return Attendance::where('session_id', $this->sessionId)->with('student');
    }

    // Tiêu đề cột trong Excel
    public function headings(): array {
        return ["Mã SV", "Họ Tên", "Thời gian quét", "Trạng thái", "Tọa độ"];
    }

    // Đổ dữ liệu vào từng cột
    public function map($attendance): array {
        return [
            $attendance->student->student_code,
            $attendance->student->full_name,
            $attendance->checkin_time,
            $attendance->status,
            $attendance->latitude . ',' . $attendance->longitude,
        ];
    }
}