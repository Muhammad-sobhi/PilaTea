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
        Schema::table('events', function (Blueprint $table) {
            $table->boolean('byo_enabled')->default(false);
            $table->integer('byo_capacity')->nullable();
            $table->decimal('byo_price', 10, 2)->nullable();
            $table->text('byo_description')->nullable();
            $table->integer('byo_spots_remaining')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['byo_enabled', 'byo_capacity', 'byo_price', 'byo_description', 'byo_spots_remaining']);
        });
    }
};
