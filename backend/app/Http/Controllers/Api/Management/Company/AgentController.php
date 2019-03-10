<?php

namespace App\Http\Controllers\Api\Management\Company;

use App\Models\Agent;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $itemsPerPage = (int)$request->get('per_page', 10);
        $page = (int)$request->get('current_page', 1);
    
        return $request->user()->getAgents($request->only([
            'search',
            'companyId',
            'name',
            'campaigns',
            'leads',
            'avg_response',
            'showDeleted',
        ]))->paginate($itemsPerPage, ['*'], 'agents', $page);
    }
    
    public function campaigns(Request $request, $agentId) {
        $itemsPerPage = (int)$request->get('per_page', 10);
        $page = (int)$request->get('current_page', 1);
        
        $agent = $request->user()->getAgentBy($agentId);
        $request->merge([
           'companyId' => $request->user()->id,
        ]);
        return $agent->getCampaignsBy($request->only([
            'showDeleted',
            'companyId',
            'name',
            'type',
            'leads',
            'avg_time_response',
        ]))->paginate($itemsPerPage, ['*'], 'agents', $page);
    }
    
    public function graph(Request $request, $agentId, $graphType)
    {
        switch ($graphType) {
            case 'contacted': {
                $startDate = $request->get('startDate', Carbon::now()->startOfWeek());
                $endDate = $request->get('endDate', Carbon::now()->endOfWeek());
                $agent = $request->user()->getAgentBy($agentId);
    
                $companyAgencyIds = $request->user()->agencies->map(function ($agency) use ($request) {
                    return $agency->pivot->id;
                });
                
                return Agent::contactedLeadsGraph($startDate, $endDate, $agent->id, $companyAgencyIds);
            }
        }
        throw new \Exception('Wrong graph type!');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Agent $agent)
    {
        $agent->handleAvatar($request);
        $agent->createAgent($request->only(['name', 'phone', 'avatar_id', 'email', 'password', 'password_confirmation']));
        $request->user()->agents()->attach($agent);
        return $agent;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        return $request->user()->getAgentBy($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $agent = $request->user()->getAgentBy($id);
        $agent->handleAvatar($request);
        $agent->updateUser($request->except('role'));
        return $agent;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $agent = $request->user()->getAgentBy($id);
        if (!$agent->agent_agency_id) {
            $agent->delete();
        } else {
            $request->user()->agents()->detach($agent);
        }
        return $agent;
    }
}
