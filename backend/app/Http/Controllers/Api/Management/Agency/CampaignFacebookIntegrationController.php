<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\DealCampaignFacebookIntegration;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CampaignFacebookIntegrationController extends Controller
{
    public function subscribe(Request $request,
                              $dealCampaign,
                              DealCampaignFacebookIntegration $dealCampaignFacebookIntegration) {
        $request->merge([
            'deal_campaign_id' => $dealCampaign,
        ]);

        $this->validate($request, [
            'deal_campaign_id' => 'required',
            'fb_page_id' => 'required',
            'fb_form_id' => 'required',
            'fb_page_access_token' => 'required|string',
        ]);

        $dealCampaignFacebookIntegration->fill($request->only([
            'deal_campaign_id',
            'form_name',
            'page_name',
            'fb_page_id',
            'fb_form_id',
            'fb_page_access_token',
            'fb_ad_account_id',
        ]));
        $dealCampaignFacebookIntegration->save();
        return $dealCampaignFacebookIntegration;
    }

    public function unsubscribe($campaign, $integration) {
        $integration = DealCampaignFacebookIntegration::where('id', $integration)->firstOrFail();
        $integration->delete();
        return $integration;
    }
}
