<?php

namespace App\Http\Controllers;

use App\Models\project;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectController extends Controller
{
    public function AddProject(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "projectName" => "required|string",
                "projectClient" => "required|string",
                "projectStartDate" => "required|date",
                "projectEmployeeLead" => "required",
                "projectContactPerson" => "required",
                "projectContactNo" => "required"
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }

            $project = new project();
            $project->name = $req->projectName;
            $project->client = $req->projectClient;
            $project->startDate = $req->projectStartDate;
            $project->employeeLeadId = $req->projectEmployeeLead;
            $project->contactPerson = $req->projectContactPerson;
            $project->contactNo = $req->projectContactNo;
            $project->save();
            if ($project->id) {
                return response()->json([
                    "status" => 200,
                    "message" => "Project Created Successfully.",
                    "data" => $project
                ], 200);
            }
            return response()->json([
                "status" => 400,
                "message" => "Something went wrong.",
                "data" => []
            ], 400);

        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!"
            ], 500);
        }
    }

    public function projectList()
    {
        $project = project::with("users")->get();
        if (!$project) {
            return response()->json([
                "success" => 400,
                "message" => "Data not found.",
                "data" => [],
            ]);
        }
        return response()->json([
            "success" => 200,
            "message" => "Data found.",
            "data" => $project,
        ]);

    }
}
