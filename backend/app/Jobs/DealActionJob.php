<?php

namespace App\Jobs;

use App\Models\DealAction;
use App\Models\Lead;
use App\Models\LeadActionHistory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Log;

class DealActionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $leadActionHistory;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(LeadActionHistory $leadActionHistory)
    {
        $this->leadActionHistory = $leadActionHistory;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        try {
            $leadActionHistory = LeadActionHistory::findOrFail($this->leadActionHistory->id);
            if ($leadActionHistory->is_completed) {
                return;
            }

            $dealAction = DealAction::findOrFail($this->leadActionHistory['deal_action_id']);
            $lead = Lead::findOrFail($this->leadActionHistory['lead_id']);

            try {
                $this->executeCommand($dealAction, $lead);
            } catch (\Exception $exception) {
                $dump = print_r($exception, true);
                Log::critical("{$exception->getMessage()}, {$dump}");
            }

            $dealAction->scheduleNextLeadAction($lead);
            $leadActionHistory->moveToCompleted();
        } catch (\Exception $exception) {
            $dump = print_r($exception, true);
            Log::critical("{$exception->getMessage()}, {$dump}");
        }
    }

    public function executeCommand(DealAction $dealAction, Lead $lead) {
        switch ($dealAction->type) {
            case DealAction::TYPE_EMAIL_MESSAGE: {
                \Artisan::command('send:email-notification', [
                    'leadId' => $lead->id,
                    'dealActionId' => $dealAction->id,
                ]);
            }
            case DealAction::TYPE_SMS_MESSAGE: {
                \Artisan::command('send:sms-notification', [
                    'leadId' => $lead->id,
                    'dealActionId' => $dealAction->id,
                ]);
            }
            case DealAction::TYPE_CHANGE_STATUS: {
                \Artisan::command('change:lead-status', [
                    'leadId' => $lead->id,
                    'dealActionId' => $dealAction->id,
                ]);
            }
            case DealAction::TYPE_BLIND_CALL: {
                \Artisan::command('create:blind-call', [
                    'leadId' => $lead->id,
                    'dealActionId' => $dealAction->id,
                ]);
            }
            case DealAction::TYPE_PUSH_NOTIFICATION: {
                \Artisan::command('send:device-notification', [
                    'leadId' => $lead->id,
                    'dealActionId' => $dealAction->id,
                ]);
            }
            default:
        }
    }
}