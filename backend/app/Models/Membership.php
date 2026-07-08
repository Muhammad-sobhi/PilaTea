<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Membership extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'duration_days',
        'features', 'badge_text', 'popular', 'active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'popular' => 'boolean',
            'active' => 'boolean',
            'price' => 'decimal:2',
        ];
    }
}
