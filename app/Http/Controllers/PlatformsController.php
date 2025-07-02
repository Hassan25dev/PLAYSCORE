<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PlatformsController extends Controller
{
    public function index()
    {
        return Inertia::render('Platforms/Index', [
            'locale' => app()->getLocale(),
        ]);
    }
}