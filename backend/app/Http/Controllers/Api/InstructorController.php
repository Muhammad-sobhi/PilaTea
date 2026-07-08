<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Instructor;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InstructorController extends Controller
{
    public function index()
    {
        return response()->json(
            Instructor::where('active', true)->get()
        );
    }

    public function show($id)
    {
        return response()->json(Instructor::findOrFail($id));
    }

    public function all()
    {
        return response()->json(Instructor::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'specialties' => 'nullable|string',
        ]);

        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('instructors', 'public');
        }

        return response()->json(Instructor::create($data), 201);
    }

    public function update(Request $request, $id)
    {
        $instructor = Instructor::findOrFail($id);
        $data = $request->only('name', 'bio', 'specialties', 'active');

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('instructors', 'public');
        }

        $instructor->update($data);
        return response()->json($instructor);
    }

    public function destroy($id)
    {
        Instructor::findOrFail($id)->delete();
        return response()->json(['message' => 'Instructor deleted']);
    }
}
