<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Booking;
use App\Models\EmailCampaign;
use App\Mail\PilateaMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
            'event_type' => 'nullable|string',
        ]);

        return response()->json(Contact::create($data), 201);
    }

    public function index()
    {
        return response()->json(
            Contact::orderBy('created_at', 'desc')->get()
        );
    }

    public function show($id)
    {
        $contact = Contact::findOrFail($id);
        if (!$contact->read_at) {
            $contact->update(['read_at' => now()]);
        }
        return response()->json($contact);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::findOrFail($id);
        if ($request->has('is_read')) {
            $contact->update(['read_at' => $request->is_read ? now() : null]);
        }
        if ($request->has('is_subscribed')) {
            $contact->update([
                'is_subscribed' => $request->is_subscribed,
                'unsubscribed_at' => $request->is_subscribed ? null : now(),
            ]);
        }
        return response()->json($contact);
    }

    public function destroy($id)
    {
        Contact::findOrFail($id)->delete();
        return response()->json(['message' => 'Contact deleted']);
    }

    public function subscribers()
    {
        return response()->json(
            Contact::where('is_subscribed', true)->orderBy('created_at', 'desc')->get()
        );
    }

    public function sendEmail(Request $request)
    {
        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
            'recipient_type' => 'required|in:all_subscribers,event_attendees,single',
            'event_id' => 'required_if:recipient_type,event_attendees|nullable|exists:events,id',
            'contact_id' => 'required_if:recipient_type,single|nullable|exists:contacts,id',
        ]);

        $recipients = [];

        if ($data['recipient_type'] === 'all_subscribers') {
            $contacts = Contact::where('is_subscribed', true)->whereNotNull('email')->get();
            foreach ($contacts as $contact) {
                $recipients[] = ['email' => $contact->email, 'name' => $contact->name, 'contact_id' => $contact->id];
            }
        } elseif ($data['recipient_type'] === 'event_attendees') {
            $bookings = Booking::where('event_id', $data['event_id'])->whereNotNull('email')->get();
            foreach ($bookings as $booking) {
                $recipients[] = ['email' => $booking->email, 'name' => $booking->name, 'contact_id' => null];
            }
        } elseif ($data['recipient_type'] === 'single') {
            $contact = Contact::findOrFail($data['contact_id']);
            $recipients[] = ['email' => $contact->email, 'name' => $contact->name, 'contact_id' => $contact->id];
        }

        $sentCount = 0;
        foreach ($recipients as $r) {
            try {
                Mail::to($r['email'])->send(new PilateaMail($data['subject'], $data['body']));
                $sentCount++;
                if ($r['contact_id']) {
                    Contact::where('id', $r['contact_id'])->update(['email_sent_at' => now()]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send email to ' . $r['email'] . ': ' . $e->getMessage());
            }
        }

        EmailCampaign::create([
            'subject' => $data['subject'],
            'body' => $data['body'],
            'recipient_type' => $data['recipient_type'],
            'event_id' => $data['event_id'] ?? null,
            'sent_count' => $sentCount,
        ]);

        return response()->json(['message' => "Email sent to {$sentCount} recipients"]);
    }
}
