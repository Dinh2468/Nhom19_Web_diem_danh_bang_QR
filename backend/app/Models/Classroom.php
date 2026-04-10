<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    protected $table = 'classes';
    protected $fillable = ['class_name'];
    public $timestamps = true;
    public function students()
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}
