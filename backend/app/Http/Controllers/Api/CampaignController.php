<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmailCampaign;
use Illuminate\Http\Request;

class CampaignController extends Controller
{
    public function index()
    {
        return response()->json(
            EmailCampaign::orderBy('created_at', 'desc')->get()
        );
    }

    public function show($id)
    {
        return response()->json(EmailCampaign::findOrFail($id));
    }
}
