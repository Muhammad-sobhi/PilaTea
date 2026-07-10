<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                if (is_array($file)) {
                    $paths = [];
                    foreach ($file as $f) {
                        if ($f instanceof \Illuminate\Http\UploadedFile) {
                            $paths[] = $f->store('settings', 'public');
                        }
                    }
                    $value = json_encode($paths);
                } else {
                    $value = $file->store('settings', 'public');
                }
            } elseif ($value instanceof \Illuminate\Http\UploadedFile) {
                $value = $value->store('settings', 'public');
            } elseif (is_array($value)) {
                $value = json_encode($value);
            }
            
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
        return response()->json(['message' => 'Settings updated']);
    }
}
