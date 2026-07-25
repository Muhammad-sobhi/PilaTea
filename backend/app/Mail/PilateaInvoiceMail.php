<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class PilateaInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $booking;
    public $pdfRawContent;

    public function __construct($booking, $pdfRawContent)
    {
        $this->booking = $booking;
        $this->pdfRawContent = $pdfRawContent;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your PilaTea Studio Invoice - #" . $this->booking->reference,
        );
    }

    public function content(): Content
    {
        $heading = "PilaTea Studio Invoice";
        $name = e($this->booking->name);
        $ref = e($this->booking->reference);
        $total = number_format($this->booking->total_price, 2);

        $bodyHtml = '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: "Poppins", "Helvetica Neue", Arial, sans-serif; background-color: #faf5ff; margin: 0; padding: 20px; color: #2b2535; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(139, 92, 246, 0.1); }
                .header { background: linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%); padding: 30px 20px; text-align: center; color: #ffffff; }
                .header h1 { margin: 0; font-size: 24px; font-weight: 400; letter-spacing: 2px; }
                .header p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.9; }
                .content { padding: 35px 25px; line-height: 1.7; font-size: 15px; }
                .badge { background: #f3e8ff; color: #6b21a8; padding: 12px 18px; border-radius: 12px; font-weight: bold; font-size: 14px; margin: 20px 0; text-align: center; border: 1px solid #e9d5ff; }
                .footer { background-color: #8b5cf6; padding: 20px; text-align: center; color: #ffffff; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>PilaTea Studio</h1>
                    <p>Sip. Stretch. Glow.</p>
                </div>
                <div class="content">
                    <p>Dear <strong>' . $name . '</strong>,</p>
                    <p>Thank you for attending your session at PilaTea Wellness Studio! We have generated your official itemized invoice detailing your event attendance and refreshments.</p>
                    <div class="badge">
                        Invoice Reference: #' . $ref . '
                    </div>
                    <p>Please find your downloadable PDF invoice attached to this email.</p>
                    <p>If you have any questions, feel free to reply directly to this email.</p>
                    <p>Warm regards,<br><strong>PilaTea Team</strong></p>
                </div>
                <div class="footer">
                    <p><strong>PilaTea Wellness Studio</strong></p>
                    <p>123 Wellness Street, Bangkok 10110 | hello@pilatea.com</p>
                    <p>&copy; ' . date('Y') . ' PilaTea. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>';

        return new Content(
            htmlString: $bodyHtml,
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromData(fn () => $this->pdfRawContent, "Invoice_{$this->booking->reference}.pdf")
                ->withMime('application/pdf'),
        ];
    }
}
