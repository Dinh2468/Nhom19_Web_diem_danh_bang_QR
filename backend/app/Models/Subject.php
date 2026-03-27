<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    public $timestamps = false;
    protected $fillable = ['subject_name'];
    public function courses()
    {
        return $this->hasMany(Course::class, 'subject_id');
    }
}
