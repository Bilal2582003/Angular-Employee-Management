<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projectEmployee', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("employeeId");
            $table->unsignedBigInteger("projectId");
            $table->date("assigndate");
            $table->string("role");
            $table->foreign("employeeId")->references("id")->on("users")->onDelete('cascade')->onUpdate('cascade');
            $table->foreign("projectId")->references("id")->on("project")->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projectEmployee', function (Blueprint $table) {
            Schema::dropIfExists('project_employee');
        });
    }
};
