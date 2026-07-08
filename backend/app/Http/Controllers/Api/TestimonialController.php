<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index()
    {
        return response()->json(
            Testimonial::where('active', true)
                ->where('featured', true)
                ->orderBy('sort_order')
                ->get()
        );
    }

    public function all()
    {
        return response()->json(
            Testimonial::orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'nullable|string',
            'content' => 'required|string',
            'rating' => 'integer|min:1|max:5',
            'featured' => 'boolean',
        ]);

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $request->file('avatar')->store('testimonials', 'public');
        }

        return response()->json(Testimonial::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $testimonial = Testimonial::findOrFail($id);
        $testimonial->update($request->all());

        if ($request->hasFile('avatar')) {
            $testimonial->avatar = $request->file('avatar')->store('testimonials', 'public');
            $testimonial->save();
        }

        return response()->json($testimonial);
    }

    public function destroy($id)
    {
        Testimonial::findOrFail($id)->delete();
        return response()->json(['message' => 'Testimonial deleted']);
    }
}
