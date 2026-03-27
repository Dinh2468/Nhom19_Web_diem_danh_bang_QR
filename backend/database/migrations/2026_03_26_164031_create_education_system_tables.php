<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Bảng Lớp học
        Schema::create('classes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('class_name', 100);
            $table->timestamps();
        });

        // 2. Bảng Môn học
        Schema::create('subjects', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('subject_name', 100);
            $table->timestamps();
        });

        // 3. Bảng Giáo viên
        Schema::create('teachers', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('teacher_code', 20)->unique();
            $table->string('full_name', 100);
            $table->string('email', 100)->unique();
            $table->timestamps();
        });

        // 4. Bảng Sinh viên
        Schema::create('students', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('student_code', 20)->unique();
            $table->string('full_name', 100);
            $table->string('email', 100)->unique();
            $table->foreignId('class_id')->constrained('classes');
            $table->timestamps();
        });

        // 5. Cập nhật bảng Users (Liên kết với Sinh viên/Giáo viên)
        Schema::table('users', function (Blueprint $table) {
            // Kiểm tra nếu chưa có cột role thì mới thêm
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', ['admin', 'teacher', 'student'])->nullable()->after('password');
            }
            $table->engine = 'InnoDB';
            $table->foreignId('student_id')->nullable()->constrained('students');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers');
        });

        // 6. Bảng Lớp môn học (Courses)
        Schema::create('courses', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->string('course_name', 100);
            $table->foreignId('subject_id')->constrained('subjects');
            $table->foreignId('teacher_id')->constrained('teachers');
            $table->foreignId('class_id')->constrained('classes');
        });

        // 7. Bảng Buổi học (Sessions)
        Schema::create('class_sessions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('course_id')->constrained('courses');
            $table->date('session_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('qr_code')->nullable();
            $table->string('qr_token')->nullable();
            $table->dateTime('expired_at')->nullable();
            $table->timestamps();
        });

        // 8. Bảng Điểm danh (Attendance)
        Schema::create('attendance', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id();
            $table->foreignId('student_id')->constrained('students');
            $table->foreignId('session_id')->constrained('class_sessions');
            $table->timestamp('checkin_time')->useCurrent();
            $table->enum('status', ['Có mặt', 'Muộn', 'Vắng mặt'])->default('Có mặt');
            $table->double('latitude')->nullable();
            $table->double('longitude')->nullable();
            $table->unique(['student_id', 'session_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('education_system_tables');
    }
};
