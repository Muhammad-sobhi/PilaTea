<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EventController extends Controller
{
    public function index()
    {
        return response()->json(
            Event::with('instructor')
                ->orderBy('event_date')
                ->orderBy('start_time')
                ->get()
        );
    }

    public function show($id)
    {
        return response()->json(
            Event::with('instructor', 'images')->findOrFail($id)
        );
    }

    public function all()
    {
        return response()->json(
            Event::with('instructor')->orderBy('event_date', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'required|string',
            'location_name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'event_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'nullable',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
            'image' => 'nullable',
            'featured' => 'boolean',
            'status' => 'in:published,draft,cancelled,completed',
            'instructor_id' => 'nullable|exists:instructors,id',
            'byo_enabled' => 'boolean',
            'byo_capacity' => 'nullable|integer|min:0',
            'byo_price' => 'nullable|numeric|min:0',
            'byo_description' => 'nullable|string',
        ]);

        $data['status'] = 'published';
        $data['slug'] = Str::slug($data['title']) . '-' . Str::random(4);
        $data['spots_remaining'] = $data['capacity'];
        if (!empty($data['byo_enabled']) && isset($data['byo_capacity'])) {
            $data['byo_spots_remaining'] = $data['byo_capacity'];
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event = Event::create($data);
        return response()->json($event, 201);
    }

    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'event_type' => 'string',
            'location_name' => 'string|max:255',
            'address' => 'nullable|string',
            'event_date' => 'date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'capacity' => 'integer|min:1',
            'price' => 'numeric|min:0',
            'image' => 'nullable',
            'featured' => 'boolean',
            'status' => 'in:published,draft,cancelled,completed',
            'instructor_id' => 'nullable|exists:instructors,id',
            'byo_enabled' => 'boolean',
            'byo_capacity' => 'nullable|integer|min:0',
            'byo_price' => 'nullable|numeric|min:0',
            'byo_description' => 'nullable|string',
        ]);

        if (isset($data['capacity'])) {
            $data['spots_remaining'] = $data['capacity'] - ($event->capacity - $event->spots_remaining);
        }

        if (isset($data['byo_capacity'])) {
            $currentUsedByo = ($event->byo_capacity ?? 0) - ($event->byo_spots_remaining ?? 0);
            $data['byo_spots_remaining'] = $data['byo_capacity'] - $currentUsedByo;
        }

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('events', 'public');
        }

        $event->update($data);
        return response()->json($event);
    }

    public function destroy($id)
    {
        Event::findOrFail($id)->delete();
        return response()->json(['message' => 'Event deleted']);
    }

    public function complete($id)
    {
        $event = Event::findOrFail($id);

        if ($event->status === 'completed') {
            return response()->json(['message' => 'Event is already completed'], 422);
        }

        $event->update(['status' => 'completed']);

        Booking::where('event_id', $id)->whereIn('payment_status', ['confirmed', 'pay_on_arrival'])->update(['payment_status' => 'completed']);

        return response()->json(['message' => 'Event marked as completed', 'event' => $event->fresh()->load('instructor')]);
    }

    public function sendThankYou($id)
    {
        $event = Event::findOrFail($id);

        if ($event->status !== 'completed') {
            return response()->json(['message' => 'Event must be completed first'], 422);
        }

        $bookings = Booking::where('event_id', $id)->where('email', '!=', '')->get();

        if ($bookings->isEmpty()) {
            return response()->json(['message' => 'No attendees to email'], 422);
        }

        $subject = 'Thank you for attending ' . $event->title;
        $body = '<p>Dear attendee,</p><p>Thank you for joining us at <strong>' . e($event->title) . '</strong>.</p><p>We hope you had a wonderful experience. We would love to see you at our next event!</p><p>Warmly,<br>The PILATEA Team</p>';

        $sentCount = 0;
        foreach ($bookings as $booking) {
            try {
                \Illuminate\Support\Facades\Mail::to($booking->email)->send(new \App\Mail\PilateaMail($subject, $body));
                $sentCount++;
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Failed to send thank-you email to ' . $booking->email . ': ' . $e->getMessage());
            }
        }

        return response()->json(['message' => "Thank-you email sent to {$sentCount} attendees"]);
    }
}
