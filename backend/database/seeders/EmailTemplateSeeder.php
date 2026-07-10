<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\EmailTemplate::updateOrCreate(
            ['slug' => 'post_event'],
            [
                'name' => 'Post-Event Thank You',
                'subject' => 'Thank you for attending our event!',
                'heading' => 'Mindful Movement & Warm Tea',
                'body' => "Dear Attendee,\n\nThank you so much for joining us at our recent session! We hope you left feeling relaxed, centered, and energized.\n\nWe loved sharing the movement and our signature tea blend with you. Keep an eye out for our upcoming events, and we hope to stretch with you again soon!\n\nWarmly,\nThe PILATEA Team",
            ]
        );

        \App\Models\EmailTemplate::updateOrCreate(
            ['slug' => 'marketing'],
            [
                'name' => 'Marketing & Newsletter',
                'subject' => 'Fresh News & Serenity Updates from PILATEA',
                'heading' => 'Sip, Stretch, and Glow with Us',
                'body' => "Hello Wellness Community!\n\nWe have some exciting news to share! New classes, outdoor venues, and curated menu items are coming your way soon.\n\nCheck out our memberships page to secure regular wellness slots at the best price. Let's make this week mindful together!\n\nWarmly,\nThe PILATEA Team",
            ]
        );

        \App\Models\EmailTemplate::updateOrCreate(
            ['slug' => 'review_request'],
            [
                'name' => 'Review Request',
                'subject' => 'We\'d Love to Hear Your Feedback!',
                'heading' => 'How Was Your Experience?',
                'body' => "Hi there,\n\nYour feedback helps us grow and improve our mindful movement experiences. We would appreciate it if you could take a brief moment to leave us a review or share your thoughts.\n\nThank you for being part of the PILATEA family!\n\nWarmly,\nThe PILATEA Team",
            ]
        );
    }
}
