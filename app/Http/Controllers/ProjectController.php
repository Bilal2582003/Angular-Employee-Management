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
                "projectContactNo" => "required",
                "projectStatus" => "required"
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
            $project->projectStatus = $req->projectStatus;
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
    public function updateProject(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "projectId" => "required",
                "projectName" => "required|string",
                "projectClient" => "required|string",
                "projectStartDate" => "required|date",
                "projectEmployeeLead" => "required",
                "projectContactPerson" => "required",
                "projectContactNo" => "required",
                "projectStatus" => "required",
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }

            $project = project::find($req->projectId);
            $project->name = $req->projectName;
            $project->client = $req->projectClient;
            $project->startDate = $req->projectStartDate;
            $project->employeeLeadId = $req->projectEmployeeLead;
            $project->contactPerson = $req->projectContactPerson;
            $project->contactNo = $req->projectContactNo;
            $project->projectStatus = $req->projectStatus;
            $project->save();
            if ($project->id) {
                return response()->json([
                    "status" => 200,
                    "message" => "Project Updated Successfully.",
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

    public function deleteProject($id)
    {
        try {
            if (!$id) {
                return response()->json([
                    "status" => 400,
                    "message" => "Invalid."
                ], 400);
            }

            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    "status" => 404,
                    "message" => "Project already deleted or not found."
                ], 404);
            }

            if (!$project->delete()) {
                return response()->json([
                    "status" => 400,
                    "message" => "We are unable to delete!"
                ], 400);
            }

            return response()->json([
                "status" => 200,
                "message" => "Deleted successfully"
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                "status" => 500,
                "message" => "An error occurred, please try again later!"
            ], 500);
        }
    }

}
