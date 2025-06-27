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
        Schema::create('project', function (Blueprint $table) {
            $table->id();
            $table->string("name", 200);
            $table->string("client", 200);
            $table->string("startDate",200);
            $table->unsignedBigInteger("employeeLeadId");
            $table->string("contactPerson", 200);
            $table->string("contactNo", 50);
            $table->string("projectStatus", 200);
            $table->foreign("employeeLeadId")->references("id")->on("users")->onDelete('cascade')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('project');
    }
};
