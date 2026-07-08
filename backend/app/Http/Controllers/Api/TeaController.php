<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeaItem;
use App\Models\TeaCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TeaController extends Controller
{
    public function items()
    {
        return response()->json(
            TeaItem::with('category')->where('active', true)->orderBy('sort_order')->get()
        );
    }

    public function categories()
    {
        return response()->json(
            TeaCategory::with('items')->orderBy('sort_order')->get()
        );
    }

    public function allItems()
    {
        return response()->json(
            TeaItem::with('category')->orderBy('sort_order')->get()
        );
    }

    public function allCategories()
    {
        return response()->json(
            TeaCategory::with('items')->orderBy('sort_order')->get()
        );
    }

    public function showItem($id)
    {
        return response()->json(TeaItem::with('category')->findOrFail($id));
    }

    public function showCategory($id)
    {
        return response()->json(TeaCategory::with('items')->findOrFail($id));
    }

    public function storeItem(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:tea_categories,id',
            'image' => 'nullable|image|max:2048',
            'ingredients' => 'nullable|string',
            'featured' => 'boolean',
            'active' => 'boolean',
        ]);

        $data['slug'] = Str::slug($data['name']) . '-' . Str::random(4);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('tea', 'public');
        }

        return response()->json(TeaItem::create($data), 201);
    }

    public function updateItem(Request $request, $id)
    {
        $item = TeaItem::findOrFail($id);
        $data = $request->validate([
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'price' => 'numeric|min:0',
            'category_id' => 'nullable|exists:tea_categories,id',
            'ingredients' => 'nullable|string',
            'featured' => 'boolean',
            'active' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('tea', 'public');
        }

        $item->update($data);
        return response()->json($item);
    }

    public function destroyItem($id)
    {
        TeaItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Tea item deleted']);
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);
        $data['slug'] = Str::slug($data['name']);
        return response()->json(TeaCategory::create($data), 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $cat = TeaCategory::findOrFail($id);
        $cat->update($request->only('name', 'description'));
        return response()->json($cat);
    }

    public function destroyCategory($id)
    {
        TeaCategory::findOrFail($id)->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}
