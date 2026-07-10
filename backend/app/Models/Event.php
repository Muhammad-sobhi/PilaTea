<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'event_type', 'location_name',
        'address', 'lat', 'lng', 'event_date', 'start_time', 'end_time',
        'capacity', 'spots_remaining', 'price', 'image', 'featured',
        'status', 'instructor_id', 'byo_enabled', 'byo_capacity',
        'byo_price', 'byo_description', 'byo_spots_remaining',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'featured' => 'boolean',
            'price' => 'decimal:2',
            'byo_enabled' => 'boolean',
            'byo_price' => 'decimal:2',
        ];
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function images()
    {
        return $this->hasMany(EventImage::class);
    }

    public function instructor()
    {
        return $this->belongsTo(Instructor::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('event_date', '>=', now()->format('Y-m-d'));
    }
}
