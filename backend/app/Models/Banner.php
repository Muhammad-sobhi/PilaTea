<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = ['title', 'subtitle', 'image', 'link_url', 'link_text', 'active', 'sort_order'];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
        ];
    }
}
