<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Các trường có thể điền (Mass assignable).
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'student_id',
        'teacher_id',
        'qr_token'
    ];

    /**
     * Các trường ẩn khi trả về API (Bảo mật).
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Ép kiểu dữ liệu.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- BỔ SUNG CÁC QUAN HỆ (RELATIONSHIPS) DƯỚI ĐÂY ---

    /**
     * Liên kết với bảng Sinh viên.
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Liên kết với bảng Giảng viên.
     */
    public function teacher()
    {
        return $this->belongsTo(Teacher::class, 'teacher_id');
    }

    /**
     * Kiểm tra xem user có phải Admin không.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Kiểm tra xem user có phải Giảng viên không.
     */
    public function isTeacher(): bool
    {
        return $this->role === 'teacher';
    }

    /**
     * Kiểm tra xem user có phải Sinh viên không.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }
}