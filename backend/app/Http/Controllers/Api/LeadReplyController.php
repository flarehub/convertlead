<?php

namespace App\Http\Controllers\Api;

use App\Models\DealAction;
use App\Models\Lead;
use App\Models\LeadNote;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Intervention\Image\Facades\Image;

class LeadReplyController extends Controller {

    public function onSMSReply(Request $request) {
        $fromNumber = ltrim(str_replace('+', '',  $request->get('From', '')), '00');
        $messageBody = $request->get('Body');
        \Log::critical('Sms reply');
        \Log::critical('number='.$fromNumber.'message='.$messageBody);

        $lead = Lead::query()
            ->where('phone', 'like', $fromNumber)
            ->orderBy('id', 'desc')
            ->firstOrFail();

        if (empty($lead)) {
            abort(400, 'Lead not found!');
        }

        $dealAction = DealAction::query()
            ->select('deal_actions.*')
            ->join('lead_action_histories as lah', 'lah.deal_action_id', '=', 'deal_actions.id')
            ->join('leads', 'leads.id', '=', 'lah.lead_id')
            ->where('deal_actions.deal_id', $lead->campaign['deal']['id'])
            ->where('deal_actions.is_root', 1)
            ->where('leads.id', $lead->id)
            ->where('lah.is_completed', 1)
            ->whereRaw('lah.deleted_at IS NULL')
            ->whereRaw('deal_actions.deleted_at IS NULL')
            ->where(function ($query) {
                $query
                    ->where('deal_actions.lead_reply_type', DealAction::LEAD_REPLY_TYPE_SMS_REPLY)
                    ->orWhere('deal_actions.lead_reply_type', DealAction::LEAD_REPLY_TYPE_SMS_REPLY_CONTAIN)
                ;
            })
            ->orderBy('deal_actions.id', 'desc')
            ->first();

        if (empty($dealAction)) {
            \Log::critical('Action not found forNumber' . $fromNumber);
            abort(400, 'Deal action not found!');
        }

        if ($dealAction->lead_reply_type === DealAction::LEAD_REPLY_TYPE_SMS_REPLY_CONTAIN) {
            $keywords = explode(',', $dealAction->lead_reply_contains);
            foreach ($keywords as $keyword) {
                $contains = stripos($messageBody, $keyword) !== -1;
                if ($contains) {
                    $this->leadReplyNote($lead, $dealAction, $fromNumber, $messageBody);
                    $dealAction->scheduleNextLeadAction($lead);
                    break;
                }
            }
        }
        elseif ($dealAction->lead_reply_type === DealAction::LEAD_REPLY_TYPE_SMS_REPLY) {
            $this->leadReplyNote($lead, $dealAction, $fromNumber, $messageBody);
            $dealAction->scheduleNextLeadAction($lead);
        }
    }

    public function leadReplyNote($lead, $dealAction, $fromNumber, $messageBody) {
        LeadNote::create([
            'lead_status_id' => $lead->lead_status_id,
            'lead_id' => $lead->id,
            'agent_id' => $lead->agent_id,
            'deal_action_id' => $dealAction->id,
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
                'deal_action_id' => $dealAction->id,
                'message' => "Lead mail opened!",
            ]);
            $dealAction->scheduleNextLeadAction($lead);
        }

        $img = Image::make(public_path('images/pixel.png'))->resize(1, 1);
        return $img->response('jpg');
    }
}
