<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Depart extends Model
{
    protected $table = "depart";
    protected $fillable  = ["name", "slug"];
    public function users(){
        return $this->belongsToMany(User::class, 'map_user_depart', 'depart_id', 'user_id');
    }
}
