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
        Schema::create('class_sessions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
    $table->date('session_date'); // Ngày học (VD: 2026-04-14)
    $table->time('start_time');   // Giờ bắt đầu
    $table->time('end_time');     // Giờ kết thúc
    $table->string('room')->nullable()->after('end_time'); // Thêm cột room
    
    // 2 cột quan trọng cho phần QR Token
    $table->string('qr_token')->nullable(); 
    $table->timestamp('expired_at')->nullable(); 
    
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('class_sessions');
    }
};
