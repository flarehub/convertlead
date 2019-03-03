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
        $min15 = 15 * 60;
        return Lead::selectRaw(
            "
          DATE(leads.created_at) as creation_date,
	   SUM(time_to_sec(timediff(ln.created_at, leads.created_at)) <= (15*60)) as up15Minutes,
             SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (15*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (30*60)
       ) as up30Mintes,
       SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (30*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (2*60*60)
       ) as up2Hours,
       SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (2*60*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (12*60*60)
       ) as up12Hours,
            SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (12*60*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (24*60*60)
       ) as up24hours,
	SUM(time_to_sec(timediff(ln.created_at, leads.created_at)) >= (24*60*60)) as 24PlusHours
     
            ")
            ->join('lead_notes AS ln', 'ln.lead_id', 'leads.id')
            ->join('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
            ->where('leads.agency_company_id', $company->pivot->id)
            ->where(function ($query) {
                $query
                    ->where('ls.type', 'CONTACTED_SMS')
                    ->orWhere('ls.type', 'CONTACTED_CALL')
                    ->orWhere('ls.type', 'CONTACTED_EMAIL')
                ;
            })
            ->groupBy('creation_date')
            ->get()->map(function ($lead) {
                return $lead->only([
                   'creation_date',
                   'up15Minutes',
                   'up30Mintes',
                   'up2Hours',
                   'up12Hours',
                   'up24hours',
                   '24PlusHours',
                ]);
            })->groupBy('creation_date');
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
