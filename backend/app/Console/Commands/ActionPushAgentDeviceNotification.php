<?php

namespace App\Console\Commands;

use App\Models\DealAction;
use App\Models\Device;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Services\MailService;
use Illuminate\Console\Command;

class ActionPushAgentDeviceNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:device-notification {leadId} {dealActionId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send to Agent Device Notification';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $leadId = $this->argument('leadId');
        $dealActionId = $this->argument('dealActionId');

        try {
            $lead = Lead::findOrFail($leadId);
            $dealAction = DealAction::findOrFail($dealActionId);


            $agentDeviceTokens = Device::getTokenListFromAgentIds([$lead->agent_id]);

            if ($agentDeviceTokens) {
                Lead::notification($agentDeviceTokens);
                LeadNote::create([
                    'lead_status_id' => $lead->lead_status_id,
                    'lead_id' => $lead->id,
                    'agent_id' => $lead->agent_id,
                    'deal_action_id' => $dealActionId,
                    'message' => "Automatic Push notification sent message: '{$dealAction->object->message}'!",
                ]);
            } else {
                LeadNote::create([
                    'lead_status_id' => $lead->lead_status_id,
                    'lead_id' => $lead->id,
                    'agent_id' => $lead->agent_id,
                    'deal_action_id' => $dealActionId,
                    'message' => "No Agent Device to Push notification message: '{$dealAction->object->message}'!",
                ]);
            }
        } catch (\Exception $exception) {
            \Log::critical("ActionSendToLeadEmailNotification:lead:{$leadId},dealAction:{$dealActionId}, {$exception->getMessage()}");
        }
    }
}
