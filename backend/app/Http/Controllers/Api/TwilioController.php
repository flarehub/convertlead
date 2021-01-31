<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use App\Models\Company;
use App\Models\Lead;
use App\Models\LeadNote;
use Twilio\Jwt\ClientToken;
use Twilio\TwiML\VoiceResponse;
use Illuminate\Http\Request;

class TwilioController extends Controller
{
    public function conference(Request $request, $companyId, $agentId) {
        $response = new VoiceResponse();
        $agent = Agent::findOrFail($agentId);
        $company = Company::findOrFail($companyId);
        $from = $request->get('Caller', '');
        $agentTwilioNumber = ($agent->twilio_mobile_number ? $agent->twilio_mobile_number : $company->twilio_mobile_number);

        // agent Call lead from client
        if (stripos($from, 'client:Anonymous') !== false) {
            $lead = Lead::query()
                ->where('agent_id', $agentId)
                ->where('phone', 'like', $request->get('number'))
                ->orderBy('id', 'desc')
                ->first();
            $agentTwilioNumber = $agentTwilioNumber ?: $lead->company['twilio_mobile_number'];

            if ($lead) {
                $recordingStatus = action([TwilioController::class, 'recording'], ['leadId' => $lead->id]);
                $dial = $response->dial('', [
                    'callerId' =>  $agentTwilioNumber,
                    'record' => 'record-from-ringing-dual',
                    'recordingStatusCallbackMethod' => 'POST',
                    'recordingStatusCallbackEvent' => 'completed',
                    'recordingStatusCallback' => $recordingStatus,
                ]);
                LeadNote::create([
                    'lead_status_id' => $lead->lead_status_id,
                    'lead_id' => $lead->id,
                    'agent_id' => $lead->agent_id,
                    'message' => "Agent call Lead!",
                ]);
            } else {
                $dial = $response->dial('', [
                    'callerId' => $agent->twilio_mobile_number,
                ]);
            }
            $dial->number($request->get('number'));
        } // Blind Call Agent call Lead via automation
        else if ($request->get('leadId', '')) {
            $lead = Lead::findOrFail($request->get('leadId', ''));
            $response->say(
                "You have a new lead {$lead->fullname}, lead source {$lead['campaign']['deal']['name']}",
                ['voice' => 'Man']
            );
            $response->dial($lead->phone);
        }
        // Lead call agent
        else {
            $lead = Lead::query()->where('phone', 'like', $from)->orderBy('id', 'desc')->firstOrFail();
            $recordingStatus = action([TwilioController::class, 'recording'], ['leadId' => $lead->id]);
            $dial = $response->dial('', [
                'record' => 'record-from-ringing-dual',
                'recordingStatusCallbackMethod' => 'POST',
                'recordingStatusCallbackEvent' => 'completed',
                'recordingStatusCallback' => $recordingStatus,
            ]);
            $agentPhone = ($agent->twilio_mobile_number ? $agent->phone : $lead->company['phone']);

            $dial->number($agentPhone);
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

    public function token($leadId) {
        $lead = Lead::query()->withTrashed()->findOrFail($leadId);
        $twilioSid = $lead->company['twilio_sid'];
        $twilioToken = $lead->company['twilio_token'];
        $appSid = $lead->agent['twilio_app_sid'];

        if (!$twilioSid && !$twilioToken) {
            return;
        }

        $clientCapability = new ClientToken(
            $twilioSid, $twilioToken
        );
        $clientCapability->allowClientOutgoing($appSid, [
            'leadId' => $leadId,
        ]);

        return response()->json([
            'token' => $clientCapability->generateToken(),
        ]);
    }
}
