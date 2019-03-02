<?php

namespace App\Http\Controllers\Api;

use App\Models\DealCampaign;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mockery\Exception;

class CampaignController extends Controller
{
    public function getIntegration(Request $request, $campaignUUID) {
        $campaign = DealCampaign::where('uuid', $campaignUUID)->firstOrFail();
        if ($campaign->integration !== DealCampaign::$INTEGRATION_OPTIN_FORM) {
            $this->validate($request, [
                'missing_integration' => 'required'
            ]);
        }
        
        return $campaign->only(['uuid', 'integration', 'integration_config']);
    }
    
    public function createLead(Request $request, $campaignUUID) {
       try {
           \DB::beginTransaction();
           $campaign = DealCampaign::where('uuid', $campaignUUID)->firstOrFail();
    
           $this->validateLead($request, $campaign);
    
           $leadStatus = LeadStatus::where('type', LeadStatus::$STATUS_NEW)->firstOrFail();

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
       
           LeadNote::create([
               'lead_status_id' => $leadStatus->id,
               'lead_id' => $lead->id,
               'agent_id' => $agent['id'],
               'message' => "Lead Created from {$campaign->integration}",
           ]);
    
           \DB::commit();

           return $lead->only([
               'id',
               'status',
               'fullname',
               'phone',
               'email',
               'metadata',
               'created_at',
               'campaign',
               'lead_notes',
               'agent',
           ]);
       } catch (Exception $exception) {
           \DB::rollBack();
           throw $exception;
       }
    }
    
    /**
     * @param Request $request
     * @param $campaign
     */
    public function validateLead(Request $request, $campaign)
    {
        $formFields = \json_decode($campaign->integration_config);
        if ($formFields->fullname->isRequired) {
            $this->validate($request, [
                'fullname' => 'required|string',
            ]);
        }
        
        if ($formFields->phone->isRequired) {
            $this->validate($request, [
                'phone' => 'required|string',
            ]);
        }
        
        
        if ($formFields->email->isRequired) {
            $this->validate($request, [
                'email' => 'required|email',
            ]);
        }
    }
}
