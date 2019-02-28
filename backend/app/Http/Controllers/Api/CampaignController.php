<?php

namespace App\Http\Controllers\Api;

use App\Models\DealCampaign;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CampaignController extends Controller
{
    public function getIntegration(Request $request, $campaignUUID) {
        $campaign = DealCampaign::where('uuid', $campaignUUID)->firstOrFail();
        if ($campaign->integration !== DealCampaign::$INTEGRATION_OPTIN_FORM) {
            $this->validate($request, [
                'missing_facebook_integration' => 'required'
            ]);
        }
        
        return $campaign->only(['uuid', 'integration', 'integration_config']);
    }
}
