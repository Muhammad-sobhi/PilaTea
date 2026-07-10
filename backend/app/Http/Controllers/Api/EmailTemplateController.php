<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailTemplate;
use App\Models\Contact;
use App\Models\Booking;
use App\Models\EmailCampaign;
use App\Mail\PilateaMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailTemplateController extends Controller
{
    public function index()
    {
        return response()->json(EmailTemplate::all());
    }

    public function show($slug)
    {
        $template = EmailTemplate::where('slug', $slug)->firstOrFail();
        return response()->json($template);
    }

    public function update(Request $request, $slug)
    {
        $template = EmailTemplate::where('slug', $slug)->firstOrFail();
        
        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'heading' => 'nullable|string|max:255',
            'body' => 'required|string',
            'image' => 'nullable',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('templates', 'public');
        }

        $template->update($data);
        return response()->json($template);
    }

    public function preview($slug)
    {
        $template = EmailTemplate::where('slug', $slug)->firstOrFail();
        $mail = new PilateaMail($template->subject, $template->body, $template->heading ?? 'PILATEA', $template->image);
        return response()->json(['html' => $mail->bodyHtml]);
    }

    public function send(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|exists:email_templates,slug',
            'recipient_type' => 'required|in:all_subscribers,event_attendees,single,booking',
            'event_id' => 'required_if:recipient_type,event_attendees|nullable|exists:events,id',
            'contact_id' => 'required_if:recipient_type,single|nullable|exists:contacts,id',
            'booking_id' => 'required_if:recipient_type,booking|nullable|exists:bookings,id',
            // Allow overrides
            'subject' => 'nullable|string',
            'heading' => 'nullable|string',
            'body' => 'nullable|string',
        ]);

        $template = EmailTemplate::where('slug', $data['slug'])->firstOrFail();

        $subject = $data['subject'] ?? $template->subject;
        $heading = $data['heading'] ?? $template->heading ?? 'PILATEA';
        $body = $data['body'] ?? $template->body;
        $image = $template->image;

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
        } elseif ($data['recipient_type'] === 'booking') {
            $booking = Booking::findOrFail($data['booking_id']);
            $recipients[] = ['email' => $booking->email, 'name' => $booking->name, 'contact_id' => null];
        }

        $sentCount = 0;
        foreach ($recipients as $r) {
            try {
                // Personalize body simple tokens if attendee context is present
                $personalizedBody = str_replace(
                    ['{name}', '{email}'],
                    [$r['name'], $r['email']],
                    $body
                );
                
                Mail::to($r['email'])->send(new PilateaMail($subject, $personalizedBody, $heading, $image));
                $sentCount++;
                if ($r['contact_id']) {
                    Contact::where('id', $r['contact_id'])->update(['email_sent_at' => now()]);
                }
            } catch (\Exception $e) {
                Log::error('Failed to send template email to ' . $r['email'] . ': ' . $e->getMessage());
            }
        }

        EmailCampaign::create([
            'subject' => $subject,
            'body' => $body,
            'recipient_type' => $data['recipient_type'],
            'event_id' => $data['event_id'] ?? null,
            'sent_count' => $sentCount,
        ]);

        return response()->json(['message' => "Email sent successfully to {$sentCount} recipients."]);
    }
}
