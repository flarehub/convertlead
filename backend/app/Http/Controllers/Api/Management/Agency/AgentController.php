<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Agent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $company)
    {
        return $request->user()->getCompanyBy($company)->agents()->paginate(15);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $company, Agent $agent)
    {
        $agent->createAgent($request->all(['name', 'phone', 'email', 'password', 'password_confirmation']));
        $request->user()->getCompanyBy($company)->agents()->attach($agent);
        return $agent;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $company, $id)
    {
        return $request->user()->getCompanyBy($company)->getCompanyAgentBy($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $company, $id)
    {
        $agent = $request->user()->getCompanyBy($company)->getCompanyAgentBy($id);
        $agent->updateUser($request->except('role'));
        return $agent;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $company, $id)
    {
        $agent = $request->user()->getCompanyBy($company)->getCompanyAgentBy($id);
        $agent->delete();
        return $agent;
    }
}
