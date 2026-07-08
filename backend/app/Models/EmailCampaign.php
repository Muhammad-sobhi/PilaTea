<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailCampaign extends Model
{
    protected $fillable = [
        'subject', 'body', 'recipient_type', 'event_id', 'sent_count',
    ];
}
