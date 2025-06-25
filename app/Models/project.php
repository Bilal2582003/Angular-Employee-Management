<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class project extends Model
{
    protected $table = "project";
   public function users()
    {
        return $this->hasMany(User::class, 'id', 'employeeLeadId');
    }

}
