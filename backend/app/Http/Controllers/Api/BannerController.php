<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index()
    {
        return response()->json(
            Banner::where('active', true)->orderBy('sort_order')->get()
        );
    }

    public function all()
    {
        return response()->json(
            Banner::orderBy('sort_order')->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string',
            'link_text' => 'nullable|string',
            'link_url' => 'nullable|string',
            'active' => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('banners', 'public');
        }

        return response()->json(Banner::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        $banner->update($request->only('title', 'subtitle', 'link_text', 'link_url', 'active'));

        if ($request->hasFile('image')) {
            $banner->image = $request->file('image')->store('banners', 'public');
            $banner->save();
        }

        return response()->json($banner);
    }

    public function destroy($id)
    {
        Banner::findOrFail($id)->delete();
        return response()->json(['message' => 'Banner deleted']);
    }
}
