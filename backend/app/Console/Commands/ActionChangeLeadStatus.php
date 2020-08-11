<?php

namespace App\Console\Commands;

use App\Models\DealAction;
use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadStatus;
use Illuminate\Console\Command;

class ActionChangeLeadStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'change:lead-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Change Lead status';

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
            $oldLeadStatus = LeadStatus::findOrFail($lead->lead_status_id);
            $leadStatus = LeadStatus::findOrFail($dealAction->object->status);

            $lead->lead_status_id = $leadStatus->id;
            $lead->save();

            LeadNote::create([
                'lead_status_id' => $leadStatus->id,
                'lead_id' => $lead->id,
                'agent_id' => $lead->agent_id,
                'message' => "Automatic Lead status changed from \"{$oldLeadStatus->name}\" to \"{$leadStatus->name}\" ",
            ]);

        } catch (\Exception $exception) {
            \Log::critical("ActionChangeLeadStatus:lead:{$leadId},dealAction:{$dealActionId}, {$exception->getMessage()}");
        }
    }
}
