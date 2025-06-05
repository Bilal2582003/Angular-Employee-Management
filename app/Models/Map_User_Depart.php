<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map_User_Depart extends Model
{
   protected $table = "map_user_depart";
    protected $fillable = ["depart_id", "user_id", "role_id"];
   public function users()
    {
        return $this->hasMany(User::class, 'depart_id', 'user_id');
    }

    public function departs()
    {
        return $this->hasMany(Depart::class, 'user_id', 'depart_id');
    }

}
