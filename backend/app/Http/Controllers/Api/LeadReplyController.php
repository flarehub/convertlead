<?php

namespace App\Http\Controllers\Api;

use App\Jobs\ActionChangeLeadStatus;
use App\Jobs\ActionConnectAgentLeadViaBlindCall;
use App\Jobs\ActionPushAgentDeviceNotification;
use App\Jobs\ActionSendToLeadEmailNotification;
use App\Jobs\ActionSendToLeadSMSNotification;
use App\Models\DealAction;
use App\Models\Lead;
use App\Models\LeadActionHistory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;
use function GuzzleHttp\Promise\queue;

class LeadReplyController extends Controller {

    public function onSMSReply(Request $request, $leadId, LeadActionHistory $leadActionHistory) {
        $lead = Lead::query()->where('id', $leadId)->firstOrFail();
        $dealAction = DealAction::query()
            ->where('deal_id', $lead->campaign['deal']['id'])
            ->where('type', DealAction::TYPE_EMAIL_MESSAGE)
            ->where('lead_reply_type', DealAction::LEAD_REPLY_TYPE_MAIL_OPEN)
            ->where('is_root', 1)
            ->firstOrFail();

        $nextDealAction = $dealAction->getNextAction();
        $nextDealAction->scheduleLeadAction($lead);
    }

    public function onMailReply(Request $request, $leadId) {
        $lead = Lead::query()->where('id', $leadId)->firstOrFail();

        $dealAction = DealAction::query()
            ->where('deal_id', $lead->campaign['deal']['id'])
            ->where('type', DealAction::TYPE_EMAIL_MESSAGE)
            ->where('lead_reply_type', DealAction::LEAD_REPLY_TYPE_MAIL_OPEN)
            ->where('is_root', 1)
            ->first();

        if ($dealAction) {
            $nextDealAction = $dealAction->getNextAction();
            $nextDealAction->scheduleLeadAction($lead);
        }

        $img = Image::make(public_path('images/pixel.png'))->resize(1, 1);
        return $img->response('jpg');
    }
}
