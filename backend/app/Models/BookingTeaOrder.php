<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BookingTeaOrder extends Model
{
    protected $fillable = [
        'booking_id', 'tea_item_id', 'quantity', 'unit_price', 'notes', 'added_by',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
        ];
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function teaItem()
    {
        return $this->belongsTo(TeaItem::class);
    }
}
