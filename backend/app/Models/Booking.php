<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'event_id', 'user_id', 'name', 'email', 'phone', 'spots_booked',
        'total_price', 'payment_status', 'payment_method', 'discount_code',
        'notes', 'reference',
    ];

    protected function casts(): array
    {
        return [
            'total_price' => 'decimal:2',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function teaOrders()
    {
        return $this->hasMany(BookingTeaOrder::class);
    }
}
