<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Agent;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AgentController extends Controller
{
    public function all(Request $request) {
        $itemsPerPage = (int)$request->get('per_page', 10);
        $page = (int)$request->get('current_page', 1);
    
        return $request->user()->getAgents($request->only([
            'search',
            'name',
            'campaigns',
            'leads',
            'avg_response',
            'showDeleted',
        ]))->paginate($itemsPerPage, ['*'], 'agents', $page);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $company)
    {
        $itemsPerPage = (int)$request->get('per_page', 100);
        $page = (int)$request->get('current_page', 1);
        return $request->user()->getCompanyBy($company)->agents()->paginate($itemsPerPage, ['*'], 'companies', $page);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $company, Agent $agent)
    {
        try {
            \DB::beginTransaction();
            $agent->handleAvatar($request);
            $request->merge(['agent_agency_id' => $request->user()->id]);
            $agent = $agent->createAgent($request->only(['name', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
            $request->user()
                ->getCompanyBy($company)
                ->agents()
                ->attach($agent);
            \DB::commit();
            return $agent;
        } catch (\PDOException $e) {
            // Woopsy
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $company, $id)
    {
        return $request->user()->getCompanyBy($company)->getAgentBy($id);
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
        try {
            \DB::beginTransaction();
            $request->merge(['agent_agency_id' => $request->user()->id]);
            $company = $request->user()->getCompanyBy($company);
            $agent = $company->getAgentBy($id);
    
            $newCompany = $request->get('new_company_id');
            if ($newCompany) {
                $company->agents()->detach($agent);
                $newCompany = $request->user()->getCompanyBy($newCompany);
                $newCompany->agents()->attach($agent);
            }
    
            $agent->handleAvatar($request);
            $agent->updateUser($request->except('role'));

            \DB::commit();
            return $agent;
        } catch (\PDOException $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $company, $id)
    {
        $company = $request->user()->getCompanyBy($company, true);
        $agent = $company->getAgentBy($id);
        $company->agents()->detach($agent);
        return $agent;
    }
}
