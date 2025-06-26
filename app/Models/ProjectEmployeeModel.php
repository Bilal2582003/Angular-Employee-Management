<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectEmployeeModel extends Model
{
    protected $table = 'projectEmployee';
    public function user()
    {
        return $this->belongsTo(User::class, 'employeeId');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'projectId');
    }
}
