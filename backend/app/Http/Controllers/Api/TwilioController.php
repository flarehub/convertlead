<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Lead;
use App\Models\LeadNote;
use Twilio\TwiML\VoiceResponse;
use Illuminate\Http\Request;

class TwilioController extends Controller
{
    public function conference(Request $request, $companyId, $agentId) {
        $agent = Agent::findOrFail($agentId);
        $from = $request->get('Caller');

        $response = new VoiceResponse();
        if ($request->get('leadId', '')) {
            $dial = $response->dial('');
            $lead = Lead::findOrFail($request->get('leadId', ''));
            $dial->number($lead->phone);
        } elseif (stripos($from, $agent->twilio_mobile_number) !== false && !$request->get('leadId', '')) {
            $dial = $response->dial('');
            $dial->conference("conference-{$companyId}-{$agentId}", [
                'startConferenceOnEnter' => true,
                'endConferenceOnExit' => true,
                'maxParticipants' => 2,
            ]);
        } else {
            $lead = Lead::query()->where('phone', 'like', $from)->orderBy('id', 'desc')->firstOrFail();
            $recordingStatus = action([TwilioController::class, 'recording'], ['leadId' => $lead->id]);
            $dial = $response->dial('', [
                'record' => 'record-from-ringing-dual',
                'recordingStatusCallbackMethod' => 'POST',
                'recordingStatusCallbackEvent' => 'completed',
                'recordingStatusCallback' => $recordingStatus,
            ]);
            $dial->number($agent->phone);
            LeadNote::create([
                'lead_status_id' => $lead->lead_status_id,
                'lead_id' => $lead->id,
                'agent_id' => $lead->agent_id,
                'message' => "Lead Call back Agent!",
            ]);
        }

        return \response($response, 200, ['Content-Type' => 'text/xml']);
    }

    public function recording(Request $request, $leadId) {
        $recordingUrl = $request->get('RecordingUrl');
        $lead = Lead::findOrFail($leadId);

        LeadNote::create([
            'lead_status_id' => $lead->lead_status_id,
            'lead_id' => $lead->id,
            'agent_id' => $lead->agent_id,
            'message' => "Call recording!",
            'recordingUrl' => $recordingUrl,
        ]);
    }
}
