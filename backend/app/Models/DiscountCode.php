<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DiscountCode extends Model
{
    protected $fillable = [
        'code', 'discount_type', 'value', 'max_uses',
        'used_count', 'expires_at', 'active',
    ];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'active' => 'boolean',
            'value' => 'decimal:2',
        ];
    }
}
