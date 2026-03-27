<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    public $timestamps = false;
    protected $fillable = ['course_name', 'subject_id', 'teacher_id', 'class_id'];
    public function sessions()
    {
        return $this->hasMany(ClassSession::class, 'course_id');
    }
}
