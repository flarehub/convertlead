<?php

namespace App\Console\Commands;

use App\Models\Lead;
use App\Models\LeadStatus;
use Carbon\Carbon;
use Illuminate\Console\Command;

class LeadStatusUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lead:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Updating Lead status...';

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
        $leadStatusNew = LeadStatus::where('type', '=', 'NEW')->firstOrFail();
        $leadStatusMissed = LeadStatus::where('type', '=', 'MISSED')->firstOrFail();
        Lead::where('leads.created_at', '<', Carbon::now()->subHours(12)->toDateTimeString())
            ->where('lead_status_id', '=', $leadStatusNew->id)
            ->update([
                'lead_status_id'  => $leadStatusMissed->id
            ]);
        $this->info('***Lead status updated!***');
    }
}
