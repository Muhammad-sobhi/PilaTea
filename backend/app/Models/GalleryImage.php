<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryImage extends Model
{
    protected $fillable = ['title', 'alt_text', 'caption', 'image', 'category', 'featured', 'sort_order'];

    protected function casts(): array
    {
        return [
            'featured' => 'boolean',
        ];
    }
}
