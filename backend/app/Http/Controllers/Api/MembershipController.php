<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use App\Models\UserMembership;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class MembershipController extends Controller
{
    public function index()
    {
        return response()->json(
            Membership::where('active', true)->orderBy('sort_order')->get()
        );
    }

    public function all()
    {
        return response()->json(
            Membership::orderBy('sort_order')->get()
        );
    }

    public function show($id)
    {
        return response()->json(Membership::findOrFail($id));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'duration_days' => 'integer|min:1',
            'features' => 'nullable|array',
            'badge_text' => 'nullable|string',
            'popular' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']);

        return response()->json(Membership::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $membership = Membership::findOrFail($id);
        $membership->update($request->all());
        return response()->json($membership);
    }

    public function destroy($id)
    {
        Membership::findOrFail($id)->delete();
        return response()->json(['message' => 'Membership deleted']);
    }

    public function purchase(Request $request)
    {
        $data = $request->validate([
            'membership_id' => 'required|exists:memberships,id',
        ]);

        $membership = Membership::findOrFail($data['membership_id']);

        $active = UserMembership::where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->first();

        if ($active) {
            return response()->json(['message' => 'You already have an active membership'], 422);
        }

        $start = now();
        $end = now()->addDays($membership->duration_days ?: 30);

        $userMembership = UserMembership::create([
            'user_id' => $request->user()->id,
            'membership_id' => $membership->id,
            'start_date' => $start,
            'end_date' => $end,
            'price_paid' => $membership->price,
            'status' => 'active',
        ]);

        return response()->json($userMembership->load('membership'), 201);
    }
}
