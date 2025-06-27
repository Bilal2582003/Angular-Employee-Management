<?php

namespace App\Http\Controllers;

use App\Models\ProjectEmployeeModel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectEmployeeController extends Controller
{
    public function crateProjectEmployee(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "employeeId" => "required",
                "projectId" => "required",
                "assignDate" => "required|date",
                "role" => "required"
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }

            $prEm = new ProjectEmployeeModel();
            $prEm->employeeId = $req->employeeId;
            $prEm->projectId = $req->projectId;
            $prEm->assignDate = $req->assignDate;
            $prEm->role = $req->role;
            if ($prEm->save()) {
                return response()->json(["status" => 200, "message" => "Project Assigned successfully.", "data" => ProjectEmployeeModel::find($prEm->id)], 200);
            }

            return response()->json(["status" => 400, "message" => "Someting went wrong."], 400);


        } catch (Exception $e) {
            return response()->json(["status" => 500, "message" => "Someting Occurs while saving Data.", "Exception" => $e], 500);
        }
    }

    public function ProjectEmployeeList()
    {
        $data = ProjectEmployeeModel::with('user')->with('project');
        if ($data->count() > 0) {
            return response()->json(["status" => 200, "message" => "Data found.", "data" => $data->get()], 200);
        }
        return response()->json(["status" => 400, "message" => "Data not found."], 500);

    }
    public function ProjectEmployeeById($id = 0)
    {
        $data = ProjectEmployeeModel::with(['user', 'project'])->find($id);

        if ($data) {
            return response()->json([
                "status" => 200,
                "message" => "Data found.",
                "data" => $data
            ], 200);
        }

        return response()->json([
            "status" => 404,
            "message" => "Data not found."
        ], 404);
    }

    public function updateProjectEmployee(Request $req)
    {
        try {
            $validate = Validator::make($req->all(), [
                "id" => 'required',
                "employeeId" => "required",
                "projectId" => "required",
                "assignDate" => "required|date",
                "role" => "required"
            ]);
            if ($validate->fails()) {
                return response()->json(["status" => 400, "message" => $validate->errors()], 400);
            }
            $data = ProjectEmployeeModel::find($req->id);
            if (!$data) {
                return response()->json(["status" => 400, "message" => "Record not found. May be deleted."], 400);
            }
            $data->employeeId = $req->employeeId;
            $data->projectId = $req->projectId;
            $data->assignDate = $req->assignDate;
            $data->role = $req->role;
            $data->save();
            return response()->json(["status" => 200, "message" => "Updated successfully."], 200);


        } catch (Exception $e) {
            return response()->json(["status" => 500, "message" => "Someting Occurs while saving Data.", "Exception" => $e], 500);
        }

    }
    public function deleteProjectEmployee($id)
    {
        $data = ProjectEmployeeModel::with(['user', 'project'])->find($id);

        if ($data) {
            $data->delete();
            return response()->json([
                "status" => 200,
                "message" => "Deleted Successfully."
            ], 200);
        }

        return response()->json([
            "status" => 404,
            "message" => "Data not found. May be Deleted"
        ], 404);
    }
}
