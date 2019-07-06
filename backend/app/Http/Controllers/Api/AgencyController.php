<?php

namespace App\Http\Controllers\Api;

use App\Models\Agency;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AgencyController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Agency $agency)
    {
        $agency->handleAvatar($request);
        $agency->createCompany($request->only(['name', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
        return $agency;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeCompany(Request $request, Agency $agency)
    {
        $agency->handleAvatar($request);
        $agency->createCompany($request->only(['name', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
        return $agency;
    }
}
