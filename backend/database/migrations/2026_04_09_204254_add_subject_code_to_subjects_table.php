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
        Schema::table('subjects', function (Blueprint $table) {
            // Thêm cột subject_code sau cột id, độ dài 20 ký tự và không được trùng (unique)
            $table->string('subject_code', 20)->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('subjects', function (Blueprint $table) {
            // Xóa cột nếu cần rollback
            $table->dropColumn('subject_code');
        });
    }
};
