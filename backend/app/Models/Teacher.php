<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    public $timestamps = false;
    protected $fillable = ['teacher_code', 'full_name', 'email'];
    public function courses()
    {

        return $this->hasMany(Course::class, 'teacher_id');
    }
}
