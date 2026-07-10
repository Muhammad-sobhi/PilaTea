<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BookingTeaOrder;
use App\Models\Event;
use App\Models\Booking;
use App\Models\TeaItem;
use Illuminate\Http\Request;

class TeaOrderController extends Controller
{
    public function index($bookingId)
    {
        $orders = BookingTeaOrder::where('booking_id', $bookingId)
            ->with(['booking', 'teaItem'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $orders]);
    }

    public function store(Request $request, $bookingId)
    {
        $data = $request->validate([
            'tea_item_id' => 'required|exists:tea_items,id',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string',
        ]);

        $booking = Booking::findOrFail($bookingId);
        $teaItem = TeaItem::findOrFail($data['tea_item_id']);

        $order = BookingTeaOrder::create([
            'booking_id' => $bookingId,
            'tea_item_id' => $data['tea_item_id'],
            'quantity' => $data['quantity'],
            'unit_price' => $teaItem->price,
            'notes' => $data['notes'] ?? null,
            'added_by' => $request->user()?->name ?? 'admin',
        ]);

        return response()->json($order->load(['booking', 'teaItem']), 201);
    }

    public function summary($bookingId)
    {
        $orders = BookingTeaOrder::where('booking_id', $bookingId)
            ->with('teaItem')
            ->get();

        $totalItems = $orders->sum('quantity');
        $byItem = $orders->groupBy('tea_item_id')->map(function ($items) {
            $first = $items->first();
            return [
                'name' => $first->teaItem->name,
                'quantity' => $items->sum('quantity'),
                'revenue' => $items->sum(fn ($i) => $i->quantity * $i->unit_price),
            ];
        })->values();

        $byBooking = $orders->groupBy('booking_id')->map(function ($items) {
            $first = $items->first();
            return [
                'booking_id' => $first->booking_id,
                'name' => $first->booking->name,
                'items' => $items->map(fn ($i) => [
                    'tea' => $i->teaItem->name,
                    'qty' => $i->quantity,
                ]),
            ];
        })->values();

        return response()->json([
            'total_orders' => $totalItems,
            'by_item' => $byItem,
            'by_booking' => $byBooking,
        ]);
    }

    public function destroy($id)
    {
        $order = BookingTeaOrder::findOrFail($id);
        $order->delete();
        return response()->json(['message' => 'Order deleted']);
    }
}
