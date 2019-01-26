<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Lang;

class ApiLoginController extends Controller {
    use AuthenticatesUsers;
    
    protected function authenticated(\Illuminate\Http\Request $request, $user)
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
    
    /**
     * Send the response after the user was authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    protected function sendLoginResponse(Request $request)
    {
        $this->clearLoginAttempts($request);
        
        return $this->authenticated($request, $this->guard()->user())
            ?: response()->json([
                "status"=>"error",
                "message"=> "Something went wrong!"], 401);
        
    }
    
    /**
     * Get the failed login response instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        return response()->json([
            "status"=>"error",
            "message"=>"Autentication Error",
            "data"=>[
                "errors"=>[
                    $this->username() => Lang::get('auth.failed'),
                ]
            ]
        ]);
    }
}