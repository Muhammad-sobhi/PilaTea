<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->boolean('is_subscribed')->default(true)->after('read_at');
            $table->timestamp('email_sent_at')->nullable()->after('is_subscribed');
            $table->timestamp('unsubscribed_at')->nullable()->after('email_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['is_subscribed', 'email_sent_at', 'unsubscribed_at']);
        });
    }
};
