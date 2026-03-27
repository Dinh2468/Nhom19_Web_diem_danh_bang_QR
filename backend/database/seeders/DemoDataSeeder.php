<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Course;
use App\Models\User;
use App\Models\ClassSession;
use App\Models\Attendance;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Thêm Lớp học [cite: 24]
        $c1 = Classroom::create(['class_name' => 'CNTT K15A']);
        $c2 = Classroom::create(['class_name' => 'CNTT K15B']);
        $c3 = Classroom::create(['class_name' => 'Kế Toán K16']);
        $c4 = Classroom::create(['class_name' => 'Marketing K14']);
        $c5 = Classroom::create(['class_name' => 'Ngôn Ngữ Anh K15']);

        // 2. Thêm Môn học [cite: 25]
        $s1 = Subject::create(['subject_name' => 'Lập trình Web']);
        $s2 = Subject::create(['subject_name' => 'Cơ sở dữ liệu']);
        $s3 = Subject::create(['subject_name' => 'Trí tuệ nhân tạo']);
        $s4 = Subject::create(['subject_name' => 'Tiếng Anh chuyên ngành']);
        $s5 = Subject::create(['subject_name' => 'Quản trị dự án']);

        // 3. Thêm Giáo viên [cite: 26]
        $gv1 = Teacher::create(['teacher_code' => 'GV001', 'full_name' => 'Nguyễn Văn An', 'email' => 'an.nv@school.edu.vn']);
        $gv2 = Teacher::create(['teacher_code' => 'GV002', 'full_name' => 'Trần Thị Bình', 'email' => 'binh.tt@school.edu.vn']);
        $gv3 = Teacher::create(['teacher_code' => 'GV003', 'full_name' => 'Lê Hoàng Nam', 'email' => 'nam.lh@school.edu.vn']);
        $gv4 = Teacher::create(['teacher_code' => 'GV004', 'full_name' => 'Phạm Minh Đức', 'email' => 'duc.pm@school.edu.vn']);
        $gv5 = Teacher::create(['teacher_code' => 'GV005', 'full_name' => 'Vũ Tuyết Mai', 'email' => 'mai.vt@school.edu.vn']);

        // 4. Thêm Sinh viên [cite: 27]
        $sv1 = Student::create(['student_code' => 'SV001', 'full_name' => 'Nguyễn Trung Kiên', 'email' => 'kien.nt@student.edu.vn', 'class_id' => $c1->id]);
        $sv2 = Student::create(['student_code' => 'SV002', 'full_name' => 'Lê Thu Thảo', 'email' => 'thao.lt@student.edu.vn', 'class_id' => $c1->id]);
        $sv3 = Student::create(['student_code' => 'SV003', 'full_name' => 'Trần Minh Quang', 'email' => 'quang.tm@student.edu.vn', 'class_id' => $c2->id]);
        $sv4 = Student::create(['student_code' => 'SV004', 'full_name' => 'Hoàng Mỹ Linh', 'email' => 'linh.hm@student.edu.vn', 'class_id' => $c3->id]);
        $sv5 = Student::create(['student_code' => 'SV005', 'full_name' => 'Đặng Quốc Bảo', 'email' => 'bao.dq@student.edu.vn', 'class_id' => $c4->id]);

        // 5. Thêm Lớp môn học (Courses) [cite: 28]
        $co1 = Course::create(['course_name' => 'Lập trình Web - Nhóm 1', 'subject_id' => $s1->id, 'teacher_id' => $gv1->id, 'class_id' => $c1->id]);
        $co2 = Course::create(['course_name' => 'Cơ sở dữ liệu - Nhóm 2', 'subject_id' => $s2->id, 'teacher_id' => $gv2->id, 'class_id' => $c1->id]);
        $co3 = Course::create(['course_name' => 'AI Cơ bản', 'subject_id' => $s3->id, 'teacher_id' => $gv3->id, 'class_id' => $c2->id]);
        $co4 = Course::create(['course_name' => 'English for IT', 'subject_id' => $s4->id, 'teacher_id' => $gv5->id, 'class_id' => $c5->id]);
        $co5 = Course::create(['course_name' => 'Project Management', 'subject_id' => $s5->id, 'teacher_id' => $gv4->id, 'class_id' => $c3->id]);

        // 6. Thêm Buổi học (Sessions) [cite: 30]
        $se1 = ClassSession::create(['course_id' => $co1->id, 'session_date' => '2026-03-27', 'start_time' => '08:00:00', 'end_time' => '10:00:00', 'qr_token' => 'token_abc_123', 'expired_at' => '2026-03-27 08:15:00']);
        $se2 = ClassSession::create(['course_id' => $co1->id, 'session_date' => '2026-04-03', 'start_time' => '08:00:00', 'end_time' => '10:00:00', 'qr_token' => 'token_def_456', 'expired_at' => '2026-04-03 08:15:00']);
        $se3 = ClassSession::create(['course_id' => $co2->id, 'session_date' => '2026-03-27', 'start_time' => '13:00:00', 'end_time' => '15:00:00', 'qr_token' => 'token_ghi_789', 'expired_at' => '2026-03-27 13:15:00']);
        $se4 = ClassSession::create(['course_id' => $co3->id, 'session_date' => '2026-03-28', 'start_time' => '09:00:00', 'end_time' => '11:00:00', 'qr_token' => 'token_jkl_012', 'expired_at' => '2026-03-28 09:15:00']);
        $se5 = ClassSession::create(['course_id' => $co5->id, 'session_date' => '2026-03-28', 'start_time' => '14:00:00', 'end_time' => '16:00:00', 'qr_token' => 'token_mno_345', 'expired_at' => '2026-03-28 14:15:00']);

        // 7. Thêm Điểm danh (Attendance) [cite: 31]
        Attendance::create(['student_id' => $sv1->id, 'session_id' => $se1->id, 'checkin_time' => '2026-03-27 08:05:00', 'status' => 'Có mặt', 'latitude' => 10.762622, 'longitude' => 106.660172]);
        Attendance::create(['student_id' => $sv2->id, 'session_id' => $se1->id, 'checkin_time' => '2026-03-27 08:10:00', 'status' => 'Có mặt', 'latitude' => 10.762625, 'longitude' => 106.660175]);
        Attendance::create(['student_id' => $sv1->id, 'session_id' => $se3->id, 'checkin_time' => '2026-03-27 13:20:00', 'status' => 'Muộn', 'latitude' => 10.762622, 'longitude' => 106.660172]);
        Attendance::create(['student_id' => $sv3->id, 'session_id' => $se4->id, 'checkin_time' => '2026-03-28 09:02:00', 'status' => 'Có mặt', 'latitude' => 10.823100, 'longitude' => 106.629700]);
        Attendance::create(['student_id' => $sv4->id, 'session_id' => $se5->id, 'checkin_time' => '2026-03-28 14:05:00', 'status' => 'Có mặt', 'latitude' => 10.823100, 'longitude' => 106.629700]);

        // 8. Thêm Users [cite: 29]
        $pw = Hash::make('password123'); // Bạn có thể dùng password từ demo.txt nếu muốn
        User::create(['name' => 'Admin System', 'email' => 'admin@school.edu.vn', 'password' => $pw, 'role' => 'admin']);
        User::create(['name' => 'GV Nguyễn Văn An', 'email' => 'an.nv@school.edu.vn', 'password' => $pw, 'role' => 'teacher', 'teacher_id' => $gv1->id]);
        User::create(['name' => 'GV Trần Thị Bình', 'email' => 'binh.tt@school.edu.vn', 'password' => $pw, 'role' => 'teacher', 'teacher_id' => $gv2->id]);
        User::create(['name' => 'SV Trung Kiên', 'email' => 'kien.nt@student.edu.vn', 'password' => $pw, 'role' => 'student', 'student_id' => $sv1->id]);
        User::create(['name' => 'SV Thu Thảo', 'email' => 'thao.lt@student.edu.vn', 'password' => $pw, 'role' => 'student', 'student_id' => $sv2->id]);
    }
}
