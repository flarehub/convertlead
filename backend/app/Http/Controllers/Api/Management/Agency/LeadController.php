<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadStatus;
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
    public function show(Request $request, $company, $id)
    {
        return $request->user()->getCompanyBy($company)->getLeadBy($id)->load(
            'leadNotes'
        );
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
        $status = $request->get('status');
        $leadStatus = LeadStatus::where('type', $status)->firstOrFail();
        $request->merge(['lead_status_id' => $leadStatus->id]);
        $hasNewStatus = $lead->lead_status_id !== $leadStatus->id;

        $lead->fill($request->only([
            'fullname',
            'email',
            'phone',
            'agent_id',
            'metadata',
            'deal_campaign_id',
            'lead_status_id',
            'agency_company_id',
        ]));
        
        if ($hasNewStatus) {
            LeadNote::create([
                'lead_status_id' => $leadStatus->id,
                'lead_id' => $lead->id,
                'agent_id' => $request->user()->id,
                'message' => 'Status changed!',
            ]);
        }
     
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
            'status' => 'required|string',
        ]);
    
        $status = $request->get('status');
        $leadStatus = LeadStatus::where('type', $status)->firstOrFail();
        $request->merge(['lead_status_id' => $leadStatus->id]);
        
        $lead = Lead::create($request->only([
            'lead_status_id',
            'fullname',
            'email',
            'phone',
            'agent_id',
            'metadata',
            'deal_campaign_id',
            'agency_company_id',
        ]));

        LeadNote::create([
            'lead_status_id' => $leadStatus->id,
            'lead_id' => $lead->id,
            'agent_id' => $request->user()->id,
            'message' => 'Lead Created manually',
        ]);
        
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
