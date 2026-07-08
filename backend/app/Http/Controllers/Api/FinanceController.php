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

        $totalMembershipRevenue = UserMembership::whereIn('status', ['active', 'expired'])
            ->sum('price_paid');

        $totalRevenue = $totalBookingRevenue + $totalMembershipRevenue;

        $totalExpenses = Expense::sum('amount');

        $netProfit = $totalRevenue - $totalExpenses;

        $todayRevenue = Booking::whereIn('payment_status', ['confirmed', 'completed', 'pay_on_arrival'])
            ->whereDate('created_at', today())
            ->sum('total_price');

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
            $expensesSum = Expense::whereYear('expense_date', $year)
                ->whereMonth('expense_date', $m)
                ->sum('amount');

            $monthlyRevenue[] = [
                'month' => $monthStr,
                'revenue' => $bookingsSum + $membershipsSum,
                'expenses' => $expensesSum,
                'net' => ($bookingsSum + $membershipsSum) - $expensesSum,
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

        $recentTransactions = $recentBookings->concat($recentExpenses)->sortByDesc('date')->take(20)->values();

        return response()->json([
            'total_revenue' => $totalRevenue,
            'total_booking_revenue' => $totalBookingRevenue,
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
