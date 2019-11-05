<?php

namespace App\Http\Controllers\Auth;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

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
        if (!$user) {
            throw new \Exception('Your credentials are incorrect . Please try again!');
        }
        $request->request->add(['scope' => $user->getPermissions()->implode(' ')]);
        $tokenRequest = Request::create(
            '/oauth/token',
            'post',
            $request->all()
        );
        return \Route::dispatch($tokenRequest);
    }

    protected function autologin(\Illuminate\Http\Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
        ]);

        $email = $request->get('email');
        $user = User::where(['email' => $email])->first();
        $permissions = array_combine(Permission::getAll(), Permission::getAll());
        $token = $user->createToken('Passport', $permissions);
        return [
            'token_type' => 'Bearer',
            'access_token' => $token->accessToken,
            'user' => $user,
        ];
    }
}