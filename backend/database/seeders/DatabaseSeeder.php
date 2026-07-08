<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Event;
use App\Models\TeaCategory;
use App\Models\TeaItem;
use App\Models\Membership;
use App\Models\Testimonial;
use App\Models\Instructor;
use App\Models\Banner;
use App\Models\GalleryImage;
use App\Models\DiscountCode;
use App\Models\Setting;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin PILATEA',
            'email' => 'admin@pilatea.com',
            'password' => bcrypt('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
        ]);

        User::create([
            'name' => 'Sarah Instructor',
            'email' => 'sarah@pilatea.com',
            'password' => bcrypt('password'),
            'role' => 'instructor',
            'phone' => '+1234567891',
            'bio' => 'Certified Pilates instructor with 5+ years experience in mat and reformer Pilates.',
        ]);

        User::create([
            'name' => 'Jessica Lee',
            'email' => 'jessica@example.com',
            'password' => bcrypt('password'),
            'role' => 'customer',
            'phone' => '+1234567892',
        ]);

        Instructor::create([
            'name' => 'Sarah Mitchell',
            'slug' => 'sarah-mitchell',
            'bio' => 'Certified Pilates instructor specializing in outdoor and group sessions. Loves combining movement with mindfulness.',
            'specialties' => 'Mat Pilates, Reformer, Outdoor Sessions, Corporate Wellness',
            'active' => true,
        ]);

        Instructor::create([
            'name' => 'Emma Chen',
            'slug' => 'emma-chen',
            'bio' => 'Wellness coach and tea enthusiast. Emma brings a unique blend of yoga, pilates, and tea ceremony to every session.',
            'specialties' => 'Yoga-Pilates Fusion, Tea Ceremony, Private Sessions',
            'active' => true,
        ]);

        Event::create([
            'title' => 'Sunset Pilates in the Park',
            'slug' => 'sunset-pilates-park',
            'description' => 'Join us for a relaxing sunset Pilates session at Lumphini Park. Connect with nature, breathe, and move your body as the sun sets.',
            'event_type' => 'outdoor',
            'location_name' => 'Lumphini Park',
            'address' => 'Lumphini Park, Bangkok',
            'event_date' => now()->addDays(7)->format('Y-m-d'),
            'start_time' => '17:30',
            'end_time' => '18:30',
            'capacity' => 25,
            'spots_remaining' => 20,
            'price' => 35.00,
            'featured' => true,
            'status' => 'published',
            'instructor_id' => 1,
        ]);

        Event::create([
            'title' => 'Rooftop Pilates Flow',
            'slug' => 'rooftop-pilates-flow',
            'description' => 'Start your morning with an energizing Pilates flow on our beautiful rooftop venue overlooking the city skyline.',
            'event_type' => 'outdoor',
            'location_name' => 'The Sky Lounge',
            'address' => '12th Floor, Central Tower, Bangkok',
            'event_date' => now()->addDays(14)->format('Y-m-d'),
            'start_time' => '07:00',
            'end_time' => '08:00',
            'capacity' => 15,
            'spots_remaining' => 15,
            'price' => 45.00,
            'featured' => true,
            'status' => 'published',
            'instructor_id' => 2,
        ]);

        Event::create([
            'title' => 'Beach Pilates & Tea',
            'slug' => 'beach-pilates-tea',
            'description' => 'Pilates on the sand followed by a curated tea experience. The ultimate wellness afternoon by the sea.',
            'event_type' => 'outdoor',
            'location_name' => 'Pattaya Beach',
            'address' => 'Pattaya Beach, Thailand',
            'event_date' => now()->addDays(21)->format('Y-m-d'),
            'start_time' => '16:00',
            'end_time' => '18:00',
            'capacity' => 30,
            'spots_remaining' => 25,
            'price' => 55.00,
            'featured' => false,
            'status' => 'published',
            'instructor_id' => 1,
        ]);

        Event::create([
            'title' => 'Corporate Wellness Pop-Up',
            'slug' => 'corporate-wellness-popup',
            'description' => 'Bringing Pilates to your workplace. A private session designed for corporate teams to de-stress and reconnect.',
            'event_type' => 'corporate',
            'location_name' => 'Your Office',
            'address' => 'Custom Location',
            'event_date' => now()->addDays(30)->format('Y-m-d'),
            'start_time' => '12:00',
            'end_time' => '13:00',
            'capacity' => 20,
            'spots_remaining' => 20,
            'price' => 500.00,
            'featured' => false,
            'status' => 'published',
            'instructor_id' => 2,
        ]);

        $cats = ['Relax', 'Energy', 'Recovery', 'Focus'];
        foreach ($cats as $i => $cat) {
            TeaCategory::create([
                'name' => $cat,
                'slug' => Str::slug($cat),
                'description' => "Teas to help you {$cat}",
                'sort_order' => $i,
            ]);
        }

        TeaItem::create(['name' => 'Calm Lavender', 'slug' => 'calm-lavender', 'description' => 'Lavender and chamomile for deep relaxation.', 'price' => 6.50, 'category_id' => 1, 'ingredients' => 'Lavender, Chamomile, Rose Petals', 'featured' => true, 'active' => true, 'sort_order' => 0]);
        TeaItem::create(['name' => 'Matcha Glow', 'slug' => 'matcha-glow', 'description' => 'Premium ceremonial matcha for energy and focus.', 'price' => 8.00, 'category_id' => 2, 'ingredients' => 'Ceremonial Matcha, Jasmine', 'featured' => true, 'active' => true, 'sort_order' => 1]);
        TeaItem::create(['name' => 'Berry Bliss', 'slug' => 'berry-bliss', 'description' => 'A fruity blend full of antioxidants and natural goodness.', 'price' => 7.00, 'category_id' => 3, 'ingredients' => 'Hibiscus, Berry Mix, Rosehip', 'featured' => false, 'active' => true, 'sort_order' => 2]);
        TeaItem::create(['name' => 'Golden Turmeric', 'slug' => 'golden-turmeric', 'description' => 'Anti-inflammatory golden milk blend for post-workout recovery.', 'price' => 7.50, 'category_id' => 3, 'ingredients' => 'Turmeric, Ginger, Cinnamon, Black Pepper', 'featured' => true, 'active' => true, 'sort_order' => 3]);
        TeaItem::create(['name' => 'Focus Mint', 'slug' => 'focus-mint', 'description' => 'Peppermint and green tea blend to sharpen your focus.', 'price' => 6.00, 'category_id' => 4, 'ingredients' => 'Peppermint, Green Tea, Lemon Balm', 'featured' => false, 'active' => true, 'sort_order' => 4]);
        TeaItem::create(['name' => 'PILATEA Signature', 'slug' => 'pilatea-signature', 'description' => 'Our signature wellness blend — a secret mix of herbs and flowers.', 'price' => 9.00, 'category_id' => 1, 'ingredients' => 'Proprietary Blend', 'featured' => true, 'active' => true, 'sort_order' => 5]);

        Membership::create(['name' => 'Stretch Starter', 'slug' => 'stretch-starter', 'description' => 'Perfect for beginners. 4 Pilates sessions per month.', 'price' => 79.00, 'duration_days' => 30, 'features' => ['4 Pilates sessions/month', 'Free tea at every visit', '10% off merchandise', 'Access to member events'], 'badge_text' => null, 'popular' => false, 'active' => true, 'sort_order' => 0]);
        Membership::create(['name' => 'Flow Membership', 'slug' => 'flow-membership', 'description' => 'Our most popular plan. 8 sessions + unlimited tea.', 'price' => 149.00, 'duration_days' => 30, 'features' => ['8 Pilates sessions/month', 'Unlimited tea bar access', '15% off merchandise', 'Priority booking', 'Exclusive member events', 'Free guest pass (1/month)'], 'badge_text' => 'Most Popular', 'popular' => true, 'active' => true, 'sort_order' => 1]);
        Membership::create(['name' => 'VIP Wellness Pass', 'slug' => 'vip-wellness-pass', 'description' => 'Unlimited everything. The ultimate wellness experience.', 'price' => 299.00, 'duration_days' => 30, 'features' => ['Unlimited Pilates sessions', 'Unlimited tea bar + to-go', '20% off all merchandise', 'VIP event access', 'Private session (2/month)', 'Guest passes (4/month)', 'Monthly wellness box'], 'badge_text' => 'VIP', 'popular' => false, 'active' => true, 'sort_order' => 2]);

        Testimonial::create(['name' => 'Jessica Lee', 'role' => 'Wellness Enthusiast', 'content' => 'PILATEA completely changed my wellness routine. The outdoor sessions are magical, and the tea is absolutely divine!', 'rating' => 5, 'featured' => true, 'active' => true, 'sort_order' => 0]);
        Testimonial::create(['name' => 'Maya Torres', 'role' => 'Yoga Instructor', 'content' => 'The combination of Pilates and tea is genius. I bring my students here for team-building retreats.', 'rating' => 5, 'featured' => true, 'active' => true, 'sort_order' => 1]);
        Testimonial::create(['name' => 'Lily Zhang', 'role' => 'Corporate Client', 'content' => 'We booked PILATEA for our company wellness day. Everyone loved it! The team felt refreshed and connected.', 'rating' => 5, 'featured' => true, 'active' => true, 'sort_order' => 2]);
        Testimonial::create(['name' => 'Sophie Kim', 'role' => 'Frequent Member', 'content' => 'The Flow Membership is worth every penny. I go to classes 3x a week and the tea bar is my favorite perk.', 'rating' => 5, 'featured' => false, 'active' => true, 'sort_order' => 3]);

        Banner::create(['title' => 'Sip. Stretch. Glow.', 'subtitle' => 'Pilates, Tea & Serenity Anywhere You Go', 'active' => true, 'sort_order' => 0]);
        Banner::create(['title' => 'Pilates on the Go', 'subtitle' => 'Outdoor classes in beautiful locations near you', 'active' => true, 'sort_order' => 1]);

        GalleryImage::create(['title' => 'Sunset Session', 'alt_text' => 'Outdoor pilates at sunset', 'image' => 'gallery/sunset.jpg', 'category' => 'Events', 'featured' => true, 'sort_order' => 0]);
        GalleryImage::create(['title' => 'Tea Bar', 'alt_text' => 'Our beautiful tea bar setup', 'image' => 'gallery/tea-bar.jpg', 'category' => 'Tea', 'featured' => true, 'sort_order' => 1]);
        GalleryImage::create(['title' => 'Studio Space', 'alt_text' => 'Inside our pilates studio', 'image' => 'gallery/studio.jpg', 'category' => 'Studio', 'featured' => false, 'sort_order' => 2]);
        GalleryImage::create(['title' => 'Group Class', 'alt_text' => 'Group pilates class in session', 'image' => 'gallery/group.jpg', 'category' => 'Events', 'featured' => false, 'sort_order' => 3]);
        GalleryImage::create(['title' => 'Rooftop Flow', 'alt_text' => 'Rooftop pilates overlooking the city', 'image' => 'gallery/rooftop.jpg', 'category' => 'Events', 'featured' => true, 'sort_order' => 4]);

        DiscountCode::create(['code' => 'WELCOME10', 'discount_type' => 'percentage', 'value' => 10.00, 'max_uses' => 100, 'used_count' => 5, 'expires_at' => now()->addMonths(3), 'active' => true]);
        DiscountCode::create(['code' => 'SUMMER25', 'discount_type' => 'percentage', 'value' => 25.00, 'max_uses' => 50, 'used_count' => 0, 'expires_at' => now()->addMonths(6), 'active' => true]);
        DiscountCode::create(['code' => 'FREEFLOW', 'discount_type' => 'fixed', 'value' => 15.00, 'max_uses' => 20, 'used_count' => 2, 'expires_at' => now()->addMonth(), 'active' => true]);

        $jessica = \App\Models\User::where('email', 'jessica@example.com')->first();
        if ($jessica) {
            \App\Models\Booking::create([
                'event_id' => 1,
                'user_id' => $jessica->id,
                'name' => $jessica->name,
                'email' => $jessica->email,
                'spots_booked' => 2,
                'total_price' => 70.00,
                'payment_status' => 'confirmed',
                'reference' => 'PLT-DEMO001',
            ]);
        }

        Setting::create(['key' => 'pay_after_attend_enabled', 'value' => '1']);
        Setting::create(['key' => 'business_email', 'value' => 'hello@pilatea.com']);
        Setting::create(['key' => 'business_phone', 'value' => '+1 (555) 123-4567']);
        Setting::create(['key' => 'address', 'value' => '123 Wellness Street, Bangkok 10110']);
        Setting::create(['key' => 'business_hours', 'value' => 'Mon-Fri: 6AM-8PM, Sat-Sun: 7AM-6PM']);
        Setting::create(['key' => 'instagram', 'value' => '@pilatea.official']);
        Setting::create(['key' => 'tiktok', 'value' => '@pilatea']);
        Setting::create(['key' => 'pinterest', 'value' => 'pilatea']);
    }
}
