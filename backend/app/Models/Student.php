<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = ['student_code', 'full_name', 'email', 'class_id'];
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'class_id');
    }
}
