<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\UserMembership;
use App\Models\Expense;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
    public function summary(Request $request)
    {
        $year = $request->get('year', date('Y'));

        $totalBookingRevenue = Booking::whereIn('payment_status', ['confirmed', 'completed', 'pay_on_arrival'])
            ->sum('total_price');

        $totalTeaRevenue = \App\Models\BookingTeaOrder::sum(\Illuminate\Support\Facades\DB::raw('quantity * unit_price'));

        $totalMembershipRevenue = UserMembership::whereIn('status', ['active', 'expired'])
            ->sum('price_paid');

        $totalRevenue = $totalBookingRevenue + $totalMembershipRevenue + $totalTeaRevenue;

        $totalExpenses = Expense::sum('amount');

        $netProfit = $totalRevenue - $totalExpenses;

        $todayBookingRevenue = Booking::whereIn('payment_status', ['confirmed', 'completed', 'pay_on_arrival'])
            ->whereDate('created_at', today())
            ->sum('total_price');

        $todayTeaRevenue = \App\Models\BookingTeaOrder::whereDate('created_at', today())
            ->sum(\Illuminate\Support\Facades\DB::raw('quantity * unit_price'));

        $todayRevenue = $todayBookingRevenue + $todayTeaRevenue;

        $monthlyRevenue = [];
        for ($m = 1; $m <= 12; $m++) {
            $monthStr = sprintf('%s-%02d', $year, $m);
            $bookingsSum = Booking::whereIn('payment_status', ['confirmed', 'completed', 'pay_on_arrival'])
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $m)
                ->sum('total_price');
            $membershipsSum = UserMembership::whereIn('status', ['active', 'expired'])
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $m)
                ->sum('price_paid');
            $teaSum = \App\Models\BookingTeaOrder::whereYear('created_at', $year)
                ->whereMonth('created_at', $m)
                ->sum(\Illuminate\Support\Facades\DB::raw('quantity * unit_price'));

            $expensesSum = Expense::whereYear('expense_date', $year)
                ->whereMonth('expense_date', $m)
                ->sum('amount');

            $monthlyRevenue[] = [
                'month' => $monthStr,
                'revenue' => $bookingsSum + $membershipsSum + $teaSum,
                'expenses' => $expensesSum,
                'net' => ($bookingsSum + $membershipsSum + $teaSum) - $expensesSum,
            ];
        }

        $expensesByCategory = Expense::selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $recentTransactions = collect();

        $recentBookings = Booking::whereIn('payment_status', ['confirmed', 'completed', 'pay_on_arrival'])
            ->with('event')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($b) => [
                'type' => 'revenue',
                'description' => 'Booking: ' . ($b->event?->title ?? 'N/A'),
                'amount' => $b->total_price,
                'date' => $b->created_at->toDateTimeString(),
            ]);

        $recentExpenses = Expense::orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($e) => [
                'type' => 'expense',
                'description' => $e->title,
                'amount' => $e->amount,
                'date' => $e->created_at->toDateTimeString(),
            ]);

        $recentTeaSales = \App\Models\BookingTeaOrder::with(['booking', 'teaItem'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($t) => [
                'type' => 'revenue',
                'description' => 'Drink: ' . ($t->teaItem?->name ?? 'Tea') . ' (Qty: ' . $t->quantity . ') - ' . ($t->booking?->name ?? 'Guest'),
                'amount' => $t->quantity * $t->unit_price,
                'date' => $t->created_at->toDateTimeString(),
            ]);

        $recentTransactions = $recentBookings->concat($recentExpenses)->concat($recentTeaSales)->sortByDesc('date')->take(20)->values();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_booking_revenue' => $totalBookingRevenue,
            'total_tea_revenue' => $totalTeaRevenue,
            'total_membership_revenue' => $totalMembershipRevenue,
            'total_expenses' => $totalExpenses,
            'net_profit' => $netProfit,
            'today_revenue' => $todayRevenue,
            'monthly_breakdown' => $monthlyRevenue,
            'expenses_by_category' => $expensesByCategory,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
