<?php

namespace App\Http\Controllers\Api\Management;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->user()->isAgency() || $request->user()->isAgent()) {
            return $request->user()->load(['permissions'])
                ->only(['id', 'name', 'avatar_path', 'role', 'permissions', 'agencies', 'email', 'phone']);
        } else {
            return $request->user()->load(['permissions', 'agencies'])
                ->only(['id', 'name', 'avatar_path', 'role', 'permissions', 'agencies', 'email', 'phone']);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request->user()->handleAvatar($request);
        $data = $request->only(['name', 'email', 'avatar_id', 'phone', 'password', 'password_confirmation']);
        return $request->user()
            ->updateUser($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        return $request->user()->delete();
    }
}
