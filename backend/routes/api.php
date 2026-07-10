<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\TeaController;
use App\Http\Controllers\Api\MembershipController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\InstructorController;
use App\Http\Controllers\Api\DiscountCodeController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeaOrderController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\EmailTemplateController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('events', [EventController::class, 'index']);
Route::get('events/{id}', [EventController::class, 'show']);
Route::get('bookings/verify/{reference}', [BookingController::class, 'verify']);
Route::get('bookings/check/{eventId}', [BookingController::class, 'checkExisting']);
Route::post('bookings/{id}/add-guests', [BookingController::class, 'addGuests']);
Route::post('bookings', [BookingController::class, 'store']);
Route::get('bookings/mine', [BookingController::class, 'myBookings'])->middleware('auth:sanctum');
Route::get('tea-items', [TeaController::class, 'items']);
Route::get('tea-categories', [TeaController::class, 'categories']);
Route::get('memberships', [MembershipController::class, 'index']);
Route::post('memberships/purchase', [MembershipController::class, 'purchase'])->middleware('auth:sanctum');
Route::get('testimonials', [TestimonialController::class, 'index']);
Route::get('gallery', [GalleryController::class, 'index']);
Route::post('contact', [ContactController::class, 'store']);
Route::get('instructors', [InstructorController::class, 'index']);
Route::get('banners', [BannerController::class, 'index']);
Route::get('settings', [SettingController::class, 'index']);
Route::post('discount-codes/validate', [DiscountCodeController::class, 'validateCode']);

// Auth routes
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('auth/user', [AuthController::class, 'user'])->middleware('auth:sanctum');

// Admin routes (protected)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('email-templates', [EmailTemplateController::class, 'index']);
    Route::get('email-templates/{slug}', [EmailTemplateController::class, 'show']);
    Route::post('email-templates/{slug}', [EmailTemplateController::class, 'update']);
    Route::get('email-templates/{slug}/preview', [EmailTemplateController::class, 'preview']);
    Route::post('email-templates/send', [EmailTemplateController::class, 'send']);
    Route::get('events/all', [EventController::class, 'all']);
    Route::get('events/{id}', [EventController::class, 'show']);
    Route::post('events', [EventController::class, 'store']);
    Route::put('events/{id}', [EventController::class, 'update']);
    Route::delete('events/{id}', [EventController::class, 'destroy']);
    Route::get('bookings', [BookingController::class, 'index']);
    Route::get('bookings/{id}', [BookingController::class, 'show']);
    Route::put('bookings/{id}', [BookingController::class, 'update']);
    Route::patch('bookings/{id}', [BookingController::class, 'update']);
    Route::delete('bookings/{id}', [BookingController::class, 'destroy']);

    Route::get('tea-items/{id}', [TeaController::class, 'showItem']);
    Route::post('tea-items', [TeaController::class, 'storeItem']);
    Route::put('tea-items/{id}', [TeaController::class, 'updateItem']);
    Route::delete('tea-items/{id}', [TeaController::class, 'destroyItem']);
    Route::get('tea-categories/{id}', [TeaController::class, 'showCategory']);
    Route::post('tea-categories', [TeaController::class, 'storeCategory']);
    Route::put('tea-categories/{id}', [TeaController::class, 'updateCategory']);
    Route::delete('tea-categories/{id}', [TeaController::class, 'destroyCategory']);

    Route::get('memberships/{id}', [MembershipController::class, 'show']);
    Route::post('memberships', [MembershipController::class, 'store']);
    Route::put('memberships/{id}', [MembershipController::class, 'update']);
    Route::delete('memberships/{id}', [MembershipController::class, 'destroy']);

    Route::post('gallery', [GalleryController::class, 'store']);
    Route::put('gallery/{id}', [GalleryController::class, 'update']);
    Route::delete('gallery/{id}', [GalleryController::class, 'destroy']);

    Route::get('testimonials/all', [TestimonialController::class, 'all']);
    Route::post('testimonials', [TestimonialController::class, 'store']);
    Route::put('testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy']);

    Route::get('contacts', [ContactController::class, 'index']);
    Route::get('contacts/{id}', [ContactController::class, 'show']);
    Route::patch('contacts/{id}', [ContactController::class, 'update']);
    Route::delete('contacts/{id}', [ContactController::class, 'destroy']);

    Route::get('banners/all', [BannerController::class, 'all']);
    Route::post('banners', [BannerController::class, 'store']);
    Route::put('banners/{id}', [BannerController::class, 'update']);
    Route::delete('banners/{id}', [BannerController::class, 'destroy']);

    Route::get('instructors/all', [InstructorController::class, 'all']);
    Route::get('instructors/{id}', [InstructorController::class, 'show']);
    Route::post('instructors', [InstructorController::class, 'store']);
    Route::put('instructors/{id}', [InstructorController::class, 'update']);
    Route::delete('instructors/{id}', [InstructorController::class, 'destroy']);

    Route::get('discount-codes', [DiscountCodeController::class, 'index']);
    Route::post('discount-codes', [DiscountCodeController::class, 'store']);
    Route::patch('discount-codes/{id}', [DiscountCodeController::class, 'update']);
    Route::delete('discount-codes/{id}', [DiscountCodeController::class, 'destroy']);

    Route::post('settings', [SettingController::class, 'update']);

    Route::get('users', [UserController::class, 'index']);
    Route::get('users/{id}', [UserController::class, 'show']);
    
    // Dashboard users CRUD (admin only)
    Route::get('dashboard-users', [UserController::class, 'adminUsers']);
    Route::post('dashboard-users', [UserController::class, 'storeAdmin']);
    Route::put('dashboard-users/{id}', [UserController::class, 'updateAdmin']);
    Route::delete('dashboard-users/{id}', [UserController::class, 'destroyAdmin']);

    // Admin listing routes (for sidebar pages)
    Route::get('events', [EventController::class, 'all']);
    Route::get('tea-items', [TeaController::class, 'allItems']);
    Route::get('tea-categories', [TeaController::class, 'allCategories']);
    Route::get('memberships', [MembershipController::class, 'all']);
    Route::get('gallery', [GalleryController::class, 'index']);
    Route::get('testimonials', [TestimonialController::class, 'all']);
    Route::get('banners', [BannerController::class, 'all']);
    Route::get('settings', [SettingController::class, 'index']);

    // Phase 1 - Event completion
    Route::post('events/{id}/complete', [EventController::class, 'complete']);
    Route::post('events/{id}/send-thank-you', [EventController::class, 'sendThankYou']);

    // Phase 2 - Drink orders
    Route::get('bookings/{bookingId}/tea-orders', [TeaOrderController::class, 'index']);
    Route::post('bookings/{bookingId}/tea-orders', [TeaOrderController::class, 'store']);
    Route::get('bookings/{bookingId}/tea-summary', [TeaOrderController::class, 'summary']);
    Route::delete('tea-orders/{id}', [TeaOrderController::class, 'destroy']);

    // Phase 3 - Email / Marketing
    Route::get('contacts/subscribers', [ContactController::class, 'subscribers']);
    Route::post('marketing/send', [ContactController::class, 'sendEmail']);
    Route::get('marketing/campaigns', [CampaignController::class, 'index']);
    Route::get('marketing/campaigns/{id}', [CampaignController::class, 'show']);

    // Phase 4 - Expenses & Finance
    Route::get('expenses', [ExpenseController::class, 'index']);
    Route::post('expenses', [ExpenseController::class, 'store']);
    Route::get('expenses/{id}', [ExpenseController::class, 'show']);
    Route::put('expenses/{id}', [ExpenseController::class, 'update']);
    Route::delete('expenses/{id}', [ExpenseController::class, 'destroy']);
    Route::get('finance/summary', [FinanceController::class, 'summary']);
});
