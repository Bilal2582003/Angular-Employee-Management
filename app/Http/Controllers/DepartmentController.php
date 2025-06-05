<?php

namespace App\Http\Controllers;

use App\Models\Depart;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    public function AddNewDepart(Request $req)
    {
        try {
            // Validation
            $validate = Validator::make($req->all(), [
                "name" => "required|string"
            ]);

            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }
            // Create department
            $depart = new Depart();
            $depart->name = $req->name;
            $depart->slug = $this->generateUniqueSlug($req->name);
            $depart->save();
            if ($depart) {
                return response()->json([
                    "status" => 200,
                    "message" => "Department created successfully",
                    "data" => $depart
                ], 200);
            } else {
                return response()->json([
                    "status" => 400,
                    "message" => "Something went wrong, please try again later!"
                ], 400);
            }
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!"
            ], 500);
        }
    }

    public function getDepart(){
        return response()->json([
            "status"=>200,
            "message"=>"Data fetched successfully.",
            "data"=> Depart::get()
        ]);
    }

    function generateUniqueSlug($title)
    {
        $slug = \Illuminate\Support\Str::slug($title);
        $count = Depart::where('slug', 'LIKE', "$slug%")->count();

        return $count > 0 ? "{$slug}-" . ($count + 1) : $slug;
    }

}
