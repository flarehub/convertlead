<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Lead;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LeadController extends Controller
{
    public function all(Request $request) {
        $itemsPerPage = (int)$request->get('per_page', 10);
        $page = (int)$request->get('current_page', 1);
        return $request
            ->user()
            ->getLeads($request->only([
                'search',
                'showDeleted',
                'name',
                'email',
                'company',
                'campaign',
            ]))
            ->paginate($itemsPerPage, ['*'], 'page', $page);
    }
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
        $company = $request->user()->getCompanyBy($company);
        $request->merge([
            'id' => $id,
            'agency_company_id' => $company->pivot->id
        ]);
        $lead = Lead::find($id);
    
        $lead->fill($request->only([
            'fullname',
            'email',
            'phone',
            'agent_id',
            'metadata',
            'deal_campaign_id',
            'agency_company_id',
        ]));
    
        $lead->save();
        return $lead;
    }
    
    public function store(Request $request, $company) {
        $company = $request->user()->getCompanyBy($company);
        $request->merge([
            'agency_company_id' => $company->pivot->id
        ]);
    
        $this->validate($request, [
            'fullname' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'agent_id' => 'required|int',
            'deal_campaign_id' => 'required|int',
            'agency_company_id' => 'required|int',
        ]);
    
        $lead = Lead::create($request->only([
            'fullname',
            'email',
            'phone',
            'agent_id',
            'metadata',
            'deal_campaign_id',
            'agency_company_id',
        ]));
    
        return $lead;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $company, $id)
    {
        $company = $request->user()->getCompanyBy($company);
        $lead = $company->getLeadBy($id);
        $lead->delete();
        return $lead;
    }
}
