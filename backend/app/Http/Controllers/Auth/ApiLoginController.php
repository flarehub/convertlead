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
        $this->validate($request, [
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);
        
        $email = $request->get('email');
        $request->request->add([
            'grant_type' => 'password',
            'client_id' => env('APP_CLIENT_ID'),
            'client_secret' => env('APP_CLIENT_SECRET'),
            'username' => $email,
        ]);

        $user = User::where(['email' => $email])->first();
        $request->request->add(['scope' => $user->getPermissions()->implode(' ')]);
        $tokenRequest = Request::create(
            '/oauth/token',
            'post',
            $request->all()
        );
        return \Route::dispatch($tokenRequest);
    }
}