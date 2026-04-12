<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $table = 'attendance';

   protected $fillable = [
    'student_id', 
    'session_id', 
    'checkin_time', 
    'status', 
    'latitude', 
    'longitude'
];

    public $timestamps = false;
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function session()
    {
        return $this->belongsTo(ClassSession::class, 'session_id');
    }
}
