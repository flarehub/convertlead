<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Company;
use App\Models\Lead;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mockery\Exception;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $itemsPerPage = (int)$request->get('per_page', 100);
        $page = (int)$request->get('current_page', 1);
        
        return $request->user()->getCompanies($request->only([
            'search',
            'name',
            'deals',
            'leads',
            'agents',
            'showDeleted',
            'avg_response',
        ]))->paginate($itemsPerPage, ['*'], 'page', $page);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Company $company)
    {
        $company->handleAvatar($request);
        $company->createCompany($request->only([
            'name',
            'is_locked',
            'avatar_id',
            'phone',
            'email',
            'password',
            'password_confirmation']));
        $request->user()->companies()->attach($company);
        return $company;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $company = $request->user()->getCompanyBy($id);

        return Lead::selectRaw(
                "
                DATE(leads.created_at) as creation_date,
SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( IF(ln.created_at IS NULL, leads.created_at,
        IF( ls.type = 'NEW', leads.created_at, ln.created_at)), leads.created_at)))) AS avgResponseTimeNew,

SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( IF(ln.created_at IS NULL, leads.created_at,
        IF( ls.type = 'VIEWED', leads.created_at, ln.created_at)), leads.created_at)))) AS avgResponseTimeViewed,

SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( IF(ln.created_at IS NULL, leads.created_at,
    IF(ls.type = 'CONTACTED_SMS' OR
        ls.type = 'CONTACTED_CALL' OR
        ls.type = 'CONTACTED_EMAIL', leads.created_at, ln.created_at)), leads.created_at)))) AS avgResponseTimeContacted,

SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( IF(ln.created_at IS NULL, leads.created_at,
    IF(ls.type = 'MISSED' OR
        ls.type = 'BAD', leads.created_at, ln.created_at)), leads.created_at)))) AS avgResponseTimeLost,

SEC_TO_TIME( AVG( TIME_TO_SEC( TIMEDIFF( IF(ln.created_at IS NULL, leads.created_at,
    IF(ls.type = 'SOLD', leads.created_at, ln.created_at)), leads.created_at)))) AS avgResponseTimeLost
                "
            )
            ->leftJoin('lead_notes as ln', 'ln.lead_id', 'leads.id')
            ->leftJoin('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
            ->groupBy('ln.id', 'creation_date')
            ->where('agency_company_id', $company->pivot->id)
            ->get()->groupBy('status');
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
        $company = $request->user()->getCompanyBy($id);
        $company->handleAvatar($request);
        $company->updateUser($request->except('role'));
        return $company;
    }
    
    public function lockStatus(Request $request, $id)
    {
        $company = $request->user()->getCompanyBy($id);
        $company->pivot->is_locked = $request->get('is_locked');
        $company->pivot->save();
        return $company;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $company = $request->user()->getCompanyBy($id);
        $company->delete();
        return $company;
    }
}
