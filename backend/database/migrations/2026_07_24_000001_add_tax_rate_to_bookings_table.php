<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('bookings', 'tax_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->decimal('tax_rate', 5, 2)->default(0)->after('total_price');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('bookings', 'tax_rate')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('tax_rate');
            });
        }
    }
};
