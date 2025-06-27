<?php

namespace App\Http\Controllers;

use App\Models\project;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class dashboard extends Controller
{
    public function getDashboard()
    {
        $pdata = project::get();
        $pTdata = project::select('projectStatus', DB::raw('count(*) as total'))
            ->groupBy('projectStatus')
            ->get();
        ;
        $edata = User::get();
        return response()->json([
            "status" => 200,
            "message" => "data found",
            "projectCount" => $pdata->count(),
            "projectData" => $pdata,
            "projectTypeData" => $pTdata,
            "employeeCount" => $edata->count(),
            "employeeData" => $edata,
        ], 200);

    }
}
