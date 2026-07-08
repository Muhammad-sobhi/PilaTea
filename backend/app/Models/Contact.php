<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'subject', 'message', 'event_type', 'read_at'];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
            'email_sent_at' => 'datetime',
            'unsubscribed_at' => 'datetime',
            'is_subscribed' => 'boolean',
        ];
    }
}
