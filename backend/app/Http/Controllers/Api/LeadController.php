<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DealCampaign;
use App\Models\Lead;
use App\Models\LeadStatus;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function callback(Request $request, $campaignUUID) {
        $this->validate($request, [
            'email' => 'required|email',
            'fullname' => 'required|string',
            'phone' => 'required|string',
        ]);

        $leadStatus = LeadStatus::where('type', LeadStatus::$STATUS_NEW)->firstOrFail();
        $campaign = DealCampaign::where('uuid', $campaignUUID)->firstOrFail();
        $agent = $campaign->agents->first();
        if (!$agent) {
            throw new \Exception('Missing required agent');
        }
        
        $campaign
            ->agents()
            ->updateExistingPivot($agent['id'], [
            'agent_leads_count' => $agent['pivot']['agent_leads_count'] + 1,
        ]);
        
        $request->merge([
            'agency_company_id' => $campaign->agency_company_id,
            'agent_id' => $agent['id'],
            'lead_status_id' => $leadStatus->id,
            'deal_campaign_id' => $campaign->id,
        ]);
        
        $lead = new Lead();
        $lead->fill($request->only([
            'agency_company_id',
            'agent_id',
            'lead_status_id',
            'deal_campaign_id',
            'fullname',
            'phone',
            'email',
            'metadata',
        ]));
        $lead->save();
        return $lead;
    }
}
