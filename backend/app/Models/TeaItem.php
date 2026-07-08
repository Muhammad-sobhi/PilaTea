<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeaItem extends Model
{
    protected $fillable = [
        'name', 'slug', 'description', 'price', 'category_id', 'image',
        'ingredients', 'featured', 'active', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
            'active' => 'boolean',
            'price' => 'decimal:2',
        ];
    }

    public function category()
    {
        return $this->belongsTo(TeaCategory::class, 'category_id');
    }
}
