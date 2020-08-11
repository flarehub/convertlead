<?php

namespace App\Http\Controllers\Api;

use App\Models\DealAction;
use App\Models\Lead;
use App\Models\LeadNote;
use Doctrine\DBAL\Query\QueryBuilder;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;

class LeadReplyController extends Controller {

    public function onSMSReply(Request $request) {
        $fromNumber = $request->get('From');
        $messageBody = $request->get('Body');

        $lead = Lead::query()
            ->where('phone', 'like', $fromNumber)
            ->orderBy('id', 'desc')
            ->firstOrFail();

        if (empty($lead)) {
            abort(400, 'Lead not found!');
        }

        $dealAction = DealAction::query()
            ->where('deal_id', $lead->campaign['deal']['id'])
            ->where('is_root', 1)
            ->where(function (QueryBuilder $query) {
                $query
                    ->where('lead_reply_type', DealAction::LEAD_REPLY_TYPE_SMS_REPLY)
                    ->orWhere('lead_reply_type', DealAction::LEAD_REPLY_TYPE_SMS_REPLY_CONTAIN)
                ;
            })
            ->orderBy('id', 'desc')
            ->firstOrFail();

        if (empty($dealAction)) {
            abort(400, 'Deal action not found!');
        }

        if ($dealAction->lead_reply_type === DealAction::LEAD_REPLY_TYPE_SMS_REPLY_CONTAIN) {
            $keywords = explode(',', $dealAction->object->keywords);
            foreach ($keywords as $keyword) {
                $contains = stripos($messageBody, $keyword) !== -1;
                if ($contains) {
                    $this->leadReplyNote($lead, $fromNumber, $messageBody);
                    $dealAction->scheduleNextLeadAction($lead);
                    break;
                }
            }
        }
        elseif ($dealAction->lead_reply_type === DealAction::LEAD_REPLY_TYPE_SMS_REPLY) {
            $this->leadReplyNote($lead, $fromNumber, $messageBody);
            $dealAction->scheduleNextLeadAction($lead);
        }
    }

    public function leadReplyNote($lead, $fromNumber, $messageBody) {
        LeadNote::create([
            'lead_status_id' => $lead->lead_status_id,
            'lead_id' => $lead->id,
            'agent_id' => $lead->agent_id,
            'message' => "Lead reply: From: {$fromNumber}, message: {$messageBody}",
        ]);
    }

    public function onMailReply(Request $request, $leadId, $dealActionId) {
        $lead = Lead::query()->where('id', $leadId)->firstOrFail();
        $dealAction = DealAction::findOrFail($dealActionId);

        if ($dealAction) {
            LeadNote::create([
                'lead_status_id' => $lead->lead_status_id,
                'lead_id' => $lead->id,
                'agent_id' => $lead->agent_id,
                'message' => "Lead mail opened!",
            ]);
            $dealAction->scheduleNextLeadAction($lead);
        }

        $img = Image::make(public_path('images/pixel.png'))->resize(1, 1);
        return $img->response('jpg');
    }
}
