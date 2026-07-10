<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiscountCode;
use Illuminate\Http\Request;

class DiscountCodeController extends Controller
{
    public function index()
    {
        return response()->json(DiscountCode::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:discount_codes',
            'discount_type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
        ]);

        return response()->json(DiscountCode::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $code = DiscountCode::findOrFail($id);
        $data = $request->validate([
            'code' => 'nullable|string|max:50|unique:discount_codes,code,' . $id,
            'discount_type' => 'nullable|in:percentage,fixed',
            'value' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
        ]);
        $code->update($data);
        return response()->json($code);
    }

    public function destroy($id)
    {
        DiscountCode::findOrFail($id)->delete();
        return response()->json(['message' => 'Discount code deleted']);
    }

    public function validateCode(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string',
        ]);

        $discount = DiscountCode::where('code', $data['code'])
            ->where('active', true)
            ->first();

        if (!$discount) {
            return response()->json(['valid' => false, 'message' => 'Invalid discount code'], 404);
        }

        if ($discount->expires_at && $discount->expires_at->isPast()) {
            return response()->json(['valid' => false, 'message' => 'Discount code has expired'], 422);
        }

        if ($discount->max_uses && $discount->used_count >= $discount->max_uses) {
            return response()->json(['valid' => false, 'message' => 'Discount code usage limit reached'], 422);
        }

        return response()->json([
            'valid' => true,
            'code' => $discount->code,
            'discount_type' => $discount->discount_type,
            'value' => $discount->value,
        ]);
    }
}
