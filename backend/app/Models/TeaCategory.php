<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeaCategory extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'image', 'sort_order'];

    public function items()
    {
        return $this->hasMany(TeaItem::class, 'category_id');
    }
}
