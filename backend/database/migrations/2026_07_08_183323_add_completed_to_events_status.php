<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('published', 'draft', 'cancelled', 'completed') DEFAULT 'published'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE events MODIFY COLUMN status ENUM('published', 'draft', 'cancelled') DEFAULT 'published'");
    }
};
