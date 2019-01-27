<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Lang;
use Laravel\Passport\Passport;

class ApiLoginController extends Controller {
    
    protected function login(\Illuminate\Http\Request $request)
    {
        $request->request->add([
            'grant_type' => 'password',
            'client_id' => env('APP_CLIENT_ID'),
            'client_secret' => env('APP_CLIENT_SECRET'),
            'username' => $request->get('email'),
        ]);
        $request->request->add(['scope' => 'manage-leads']);
        $tokenRequest = Request::create(
            '/oauth/token',
            'post',
            $request->all()
        );
        return \Route::dispatch($tokenRequest);
    }
}