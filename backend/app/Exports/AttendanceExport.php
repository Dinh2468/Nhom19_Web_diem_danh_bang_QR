<?php

namespace App\Exports;

use App\Models\Student;
use App\Models\ClassSession;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Facades\DB;

class AttendanceExport implements FromQuery, WithHeadings, WithMapping
{
    protected $sessionId;

    public function __construct($sessionId)
    {
        $this->sessionId = $sessionId;
    }

    public function query()
    {
        // 1. Lấy thông tin buổi học để biết thuộc lớp (class_id) nào
        $session = ClassSession::with('course')->findOrFail($this->sessionId);
        $classId = $session->course->class_id;

        // 2. Truy vấn tất cả sinh viên trong lớp đó
        // Sau đó Left Join với bảng attendance để lấy thông tin điểm danh (nếu có)
        return Student::query()
            ->where('students.class_id', $classId)
            ->leftJoin('attendance', function ($join) {
                $join->on('students.id', '=', 'attendance.student_id')
                    ->where('attendance.session_id', '=', $this->sessionId);
            })
            ->select([
                'students.student_code',
                'students.full_name',
                'attendance.checkin_time',
                'attendance.status',
                'attendance.latitude',
                'attendance.longitude'
            ])
            ->orderBy('students.student_code', 'asc');
    }

    public function headings(): array
    {
        return ["Mã SV", "Họ Tên", "Thời gian quét", "Trạng thái", "Tọa độ"];
    }

    public function map($row): array
    {
        return [
            $row->student_code,
            $row->full_name,
            $row->checkin_time ?? '---', // Nếu NULL thì hiển thị vắng
            $row->status ?? 'Vắng mặt',  // Nếu không có record attendance thì là Vắng
            ($row->latitude && $row->longitude) ? $row->latitude . ',' . $row->longitude : 'N/A',
        ];
    }
}
