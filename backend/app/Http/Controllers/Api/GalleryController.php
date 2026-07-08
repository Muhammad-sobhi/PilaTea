<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json(
            GalleryImage::orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'category' => 'string',
            'featured' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('gallery', 'public');
        }

        return response()->json(GalleryImage::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $image = GalleryImage::findOrFail($id);
        $image->update($request->only('title', 'alt_text', 'category', 'featured', 'sort_order'));

        if ($request->hasFile('image')) {
            $image->image = $request->file('image')->store('gallery', 'public');
            $image->save();
        }

        return response()->json($image);
    }

    public function destroy($id)
    {
        GalleryImage::findOrFail($id)->delete();
        return response()->json(['message' => 'Gallery image deleted']);
    }
}
