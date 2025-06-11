<?php

namespace App\Http\Controllers;

use App\Models\Map_User_Depart;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\HasApiTokens;

class UserController extends Controller
{
    public function register(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "name" => "required|string",
                "email" => "required|email",
                "password" => "required",
                "role" => "required|string",
                "depart_id" => "required|integer"
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }

            $checkAlreadyExists = User::where("email", $req->email)->first();
            if (!$checkAlreadyExists) {
                // Create department
                $user = new User();
                $user->name = $req->name;
                $user->email = $req->email;
                $user->password = Hash::make($req->password);
                $user->save();
            } else {
                $user = $checkAlreadyExists;
            }

            $existingMapping = Map_User_Depart::where([
                'user_id' => $user->id,
                'depart_id' => $req->depart_id
            ])->first();

            if ($existingMapping) {
                return response()->json([
                    "status" => 400,
                    "message" => "User already exits.",
                    "data" => []
                ], 400);
            }

            $map_user_depart = new Map_User_Depart();
            $map_user_depart->user_id = $user->id;
            $map_user_depart->depart_id = $req->depart_id;
            $map_user_depart->role = $req->role;
            $map_user_depart->save();

            $data = User::with("departs")->find($user->id);

            if ($user) {
                return response()->json([
                    "status" => 200,
                    "message" => "User created successfully",
                    "data" => $data
                ], 200);
            } else {
                return response()->json([
                    "status" => 500,
                    "message" => "Something went wrong, please try again later!"
                ], 500);
            }
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!"
            ], 500);
        }
    }
    public function login(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "email" => "required|email",
                "password" => "required"
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }

            $user = User::with("departs")->where("email", $req->email)->first();

            if ($user && Hash::check($req->password, $user->password)) {
                $token = $user->createToken("auth_token")->plainTextToken;
                return response()->json([
                    "status" => 200,
                    "message" => "Login successful",
                    "token" => $token,
                    "data" => $user
                ], 200);
            } else {
                return response()->json([
                    "status" => 400,
                    "message" => "Invalid email or password"
                ], 400);
            }

        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!"
            ], 500);
        }
    }


    public function getUser($id = null)
    {
        try {
            $query = User::with("departs");

            if ($id) {
                $user = $query->find($id);
                $data = $user ? [$user] : []; // Avoiding redundant find() calls
            } else {
                $data = $query->get();
            }

            return response()->json([
                "success" => count($data) > 0 ? 200 : 400,
                "message" => count($data) > 0 ? "Data found." : "Data not found.",
                "data" => $data,
            ]);
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!",
                "data" => []
            ], 500);
        }
    }
    public function deletetUser($id)
    {
        try {   
            $query = User::find($id);
            if (!$query) {
                return response()->json([
                    "success" => 400,
                    "message" => "Data not found.",
                    "data" => [],
                ]);
            }
            $query->delete();

            return response()->json([
                "success" => 200,
                "message" => "Deleted successfully",
                "data" => [],
            ]);
        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!",
                "data" => []
            ], 500);
        }
    }




}
