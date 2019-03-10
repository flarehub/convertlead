<?php

namespace App\Models;

use App\Repositories\AgentRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agent extends User
{
    use AgentRepository, SoftDeletes;
    
    protected $appends = ['avatar_path', 'permissions', 'company', 'companies'];
    
    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'company_agents', 'agent_id');
    }

    public function campaigns() {
        return $this->belongsToMany('App\Models\DealCampaign', 'deal_campaign_agents', 'agent_id');
    }
    
    public function getCompanyAttribute() {
        if ($this->company_id) {
            $company = Company::withTrashed()->find($this->company_id);
            return ($company ? $company->only(['name', 'email', 'avatar_path']) : null);
        }
        return null;
    }

    public function getCompaniesAttribute() {
        $companies = $this->companies()->get();
        if ($companies) {
            return collect($companies)->map(function ($company)  {
                return $company->only(['id', 'name', 'email', 'avatar_path']);
            });
        }
        return null;
    }
    
    public function getCampaignsBy($queryParams = []) {
        $query = $this->campaigns()
            ->leftJoin('leads', 'leads.deal_campaign_id', 'deal_campaigns.id')
            ->leftJoin(\DB::raw("
            (SELECT lead_notes.lead_id, MIN(lead_notes.created_at) AS created_at
                          FROM lead_notes JOIN lead_statuses ON lead_statuses.id = lead_notes.lead_status_id
                          WHERE
                              lead_statuses.type = 'CONTACTED_SMS' OR
                              lead_statuses.type = 'CONTACTED_CALL' OR
                              lead_statuses.type = 'CONTACTED_EMAIL' GROUP BY lead_notes.lead_id) AS leadNotes
                          "), function ($join) {
                $join->on('leadNotes.lead_id', '=', 'leads.id');
            })->leftJoin('agency_companies as ac', 'ac.id', 'deal_campaigns.agency_company_id')
        ;
    
        $query->selectRaw('
            deal_campaigns.*,
            ac.company_id,
            COUNT(leads.id) as leads_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(leadNotes.created_at, leads.created_at)))) AS avg_time_response
        ');
        $query->groupBy('deal_campaigns.id', 'deal_campaign_agents.agent_id');

        if (isset($queryParams['showDeleted']) && $queryParams['showDeleted'] === 'true') {
            $query->withTrashed();
        }
    
        if ( isset($queryParams['name']) ) {
            $query->orderBy('name', ($queryParams['name'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        if ( isset($queryParams['type']) ) {
            $query->orderBy('integration', ($queryParams['type'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        if ( isset($queryParams['leads']) ) {
            $query->orderBy('leads_count', ($queryParams['leads'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        if ( isset($queryParams['avg_time_response']) ) {
            $query->orderBy('avg_time_response', ($queryParams['avg_time_response'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        return $query;
    }
}
