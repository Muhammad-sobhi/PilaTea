<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Event;
use App\Models\DiscountCode;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class BookingController extends Controller
{
    public function index()
    {
        return response()->json(
            Booking::with(['event', 'user'])->orderBy('created_at', 'desc')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'spots_booked' => 'required|integer|min:1',
            'payment_method' => 'nullable|string|in:card,pay_on_arrival',
            'discount_code' => 'nullable|string|exists:discount_codes,code',
            'notes' => 'nullable|string',
        ]);

        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }
        if ($user) {
            $data['user_id'] = $user->id;
        }

        $event = Event::findOrFail($data['event_id']);

        if ($event->spots_remaining < $data['spots_booked']) {
            return response()->json(['message' => 'Not enough spots available'], 422);
        }

        $totalPrice = $event->price * $data['spots_booked'];

        if (!empty($data['discount_code'])) {
            $discount = DiscountCode::where('code', $data['discount_code'])
                ->where('active', true)
                ->first();

            if ($discount && (!$discount->max_uses || $discount->used_count < $discount->max_uses)) {
                if ($discount->discount_type === 'percentage') {
                    $totalPrice -= ($totalPrice * $discount->value / 100);
                } else {
                    $totalPrice -= $discount->value;
                }
                $totalPrice = max(0, $totalPrice);
                $discount->increment('used_count');
            }
        }

        $data['total_price'] = $totalPrice;
        $data['reference'] = 'PLT-' . strtoupper(Str::random(8));
        $data['payment_status'] = ($data['payment_method'] ?? '') === 'pay_on_arrival' ? 'pay_on_arrival' : 'pending';

        $booking = Booking::create($data);
        $event->decrement('spots_remaining', $data['spots_booked']);

        return response()->json($booking->load('user'), 201);
    }

    public function show($id)
    {
        return response()->json(Booking::with(['event', 'user'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->update($request->only('payment_status', 'notes'));
        return response()->json($booking);
    }

    public function destroy($id)
    {
        Booking::findOrFail($id)->delete();
        return response()->json(['message' => 'Booking deleted']);
    }

    public function verify($reference)
    {
        return response()->json(Booking::with(['event', 'user'])->where('reference', $reference)->firstOrFail());
    }

    public function checkExisting(Request $request, $eventId)
    {
        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }
        if (!$user) {
            return response()->json(['booking' => null]);
        }

        $booking = Booking::where('user_id', $user->id)
            ->where('event_id', $eventId)
            ->with('event')
            ->first();

        return response()->json(['booking' => $booking]);
    }

    public function myBookings(Request $request)
    {
        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(
            Booking::with('event')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function addGuests(Request $request, $id)
    {
        $data = $request->validate([
            'additional_spots' => 'required|integer|min:1',
            'payment_method' => 'nullable|string|in:card,pay_on_arrival',
        ]);

        $user = null;
        if ($token = $request->bearerToken()) {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }

        $booking = Booking::findOrFail($id);

        if (!$user || $booking->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $event = Event::findOrFail($booking->event_id);

        if ($event->spots_remaining < $data['additional_spots']) {
            return response()->json(['message' => 'Not enough spots available'], 422);
        }

        $booking->spots_booked += $data['additional_spots'];
        $booking->total_price = $event->price * $booking->spots_booked;
        $booking->payment_method = $data['payment_method'] ?? $booking->payment_method;
        $booking->payment_status = ($data['payment_method'] ?? '') === 'pay_on_arrival' ? 'pay_on_arrival' : 'pending';
        $booking->save();

        $event->decrement('spots_remaining', $data['additional_spots']);

        return response()->json($booking->load('event'));
    }
}
