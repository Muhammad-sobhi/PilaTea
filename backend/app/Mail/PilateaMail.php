<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PilateaMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectText;
    public $bodyHtml;
    public $heading;
    public $imagePath;

    public function __construct($subject, $body, $heading = 'PILATEA Wellness', $imagePath = null)
    {
        $this->subjectText = $subject;
        $this->heading = $heading;
        $this->imagePath = $imagePath;
        
        $logoUrl = asset('logo.png');
        $headerColor = '#e8a6f4'; // Brand lilac/pink
        $footerColor = '#cdb7ff'; // Brand secondary/purple
        $imageUrlHtml = '';
        
        if ($imagePath) {
            $imageUrl = filter_var($imagePath, FILTER_VALIDATE_URL) ? $imagePath : asset('storage/' . $imagePath);
            $imageUrlHtml = '<div style="margin: 20px 0; text-align: center;"><img src="' . $imageUrl . '" style="max-width: 100%; border-radius: 12px; height: auto;" /></div>';
        }

        $formattedBody = nl2br(e($body));
        
        $this->bodyHtml = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: "Poppins", "Helvetica Neue", Arial, sans-serif; background-color: #f8f4f8; margin: 0; padding: 20px; color: #2b2535; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(155, 130, 200, 0.1); }
                .header { background: linear-gradient(135deg, ' . $headerColor . ' 0%, #cdb7ff 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px; }
                .header p { margin: 5px 0 0 0; font-size: 14px; opacity: 0.9; }
                .content { padding: 35px 25px; line-height: 1.7; font-size: 16px; }
                .footer { background-color: ' . $footerColor . '; padding: 20px; text-align: center; color: #ffffff; font-size: 12px; }
                .footer a { color: #ffffff; text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>' . e($heading) . '</h1>
                    <p>Sip. Stretch. Glow.</p>
                </div>
                <div class="content">
                    ' . $imageUrlHtml . '
                    ' . $formattedBody . '
                </div>
                <div class="footer">
                    <p><strong>PILATEA Studio</strong></p>
                    <p>123 Wellness Street, Bangkok 10110 | +1 (555) 123-4567 | hello@pilatea.com</p>
                    <p>&copy; ' . date('Y') . ' PILATEA. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>';
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectText,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->bodyHtml,
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
