<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Mail\PilateaInvoiceMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function download($bookingId)
    {
        $booking = Booking::with(['event', 'user', 'teaOrders.teaItem'])->findOrFail($bookingId);

        try {
            $pdf = Pdf::loadView('invoices.pdf', compact('booking'))
                      ->setPaper('a4', 'portrait');

            return $pdf->download("Invoice_{$booking->reference}.pdf");
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function send($bookingId)
    {
        $booking = Booking::with(['event', 'user', 'teaOrders.teaItem'])->findOrFail($bookingId);

        if (!$booking->email) {
            return response()->json(['error' => 'Attendee has no email address.'], 422);
        }

        try {
            $pdf = Pdf::loadView('invoices.pdf', compact('booking'))
                      ->setPaper('a4', 'portrait');

            $pdfContent = $pdf->output();

            Mail::to($booking->email, $booking->name)
                ->send(new PilateaInvoiceMail($booking, $pdfContent));

            return response()->json(['message' => "Invoice sent successfully to {$booking->email}"]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
