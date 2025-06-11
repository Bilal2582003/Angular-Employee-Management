<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user(); // Will return authenticated user's data
});
Route::get('', function () {
    return response()->json(['message' => 'This is an example API route']);
});

Route::prefix("EmpoyeeManagemet")->group(function () {

    // authenticated route 
   
        Route::post("addDepart", [DepartmentController::class, "AddNewDepart"])->middleware("auth:sanctum");
        Route::get("getDepart", [DepartmentController::class, "getDepart"])->middleware("auth:sanctum");
    Route::post("register", [UserController::class, "register"])->middleware("auth:sanctum");
    Route::get("employee-list/{id?}", [UserController::class, "getUser"])->middleware(["auth:sanctum"]);
    Route::get("employee-list/delete/{id}", [UserController::class, "deletetUser"])->middleware(["auth:sanctum"]);
    Route::post("login", [UserController::class, "login"])->name("login");
});
