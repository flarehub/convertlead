<?php

namespace App\Http\Controllers\Api;

use App\Models\DealCampaign;
use App\Models\DealCampaignFacebookIntegration;
use App\Models\Device;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadStatus;
use Facebook\Facebook;
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
           $request->merge([
               'metadata' => \json_encode($request->input('metadata')),
           ]);
           
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

           $notification = [
               'title' => 'New Lead',
               'body' => 'New Lead created: '.$lead->fullname,
               'sound' => true,
           ];
           $tokenList = Device::getTokenListFromAgentIds([$lead->agent_id]);
           Lead::notification($tokenList, $notification);

           $lead->only([
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
           return $lead;
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

    public function facebookWebHook(Request $request) {
        \Log::critical(json_encode($_REQUEST));
        $challenge = isset($_REQUEST['hub_challenge']) ? $_REQUEST['hub_challenge'] : null;
        $verify_token = isset($_REQUEST['hub_verify_token']) ? $_REQUEST['hub_verify_token'] : null;
        echo $challenge;
        return;
    }

    public function facebookWebHookPost(Request $request, Facebook $fb) {
        $leads = $request->input('entry');
        if ($leads) {
            foreach($leads as $lead) {
                foreach ($lead['changes'] as $leadFields) {
                    $leadForm = $leadFields['value'];
                    $leadId = $leadForm['leadgen_id'];

                    $found = DealCampaignFacebookIntegration::where('fb_form_id', $leadForm['form_id'])
                        ->where('fb_page_id', $leadForm['page_id'])->first();

                    if (!$found) {
                        \Log::critical(print_r($leadForm, true));
                        continue;
                    }
//                    $accessToken = $found->fb_page_access_token;
//                    $dealCampaign = DealCampaign::where('id', $found->deal_campaign_id)->firstOrFail();
//                    $oAuth2Client = $fb->getOAuth2Client();
//                    $longLiveAccessToken = $oAuth2Client->getLongLivedAccessToken($accessToken)->getValue();
//                    $fb->setDefaultAccessToken($longLiveAccessToken);
//                    $lead = $fb->get("/{$leadId}");
//                    $request->merge([
//                        ''
//                    ]);

                    $this->createLead($request, $dealCampaign->uuid);

                    return $found;
                }
            }
        }

        $challenge = isset($_REQUEST['hub_challenge']) ? $_REQUEST['hub_challenge'] : null;
        $verify_token = isset($_REQUEST['hub_verify_token']) ? $_REQUEST['hub_verify_token'] : null;
        echo $challenge;
        return;
    }
}
