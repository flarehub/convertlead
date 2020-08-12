<?php

namespace App\Models;

use App\Repositories\DealRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deal extends Model
{
    use DealRepository, SoftDeletes;

    protected $fillable = [
        'id',
        'name',
        'description',
        'agency_company_id',
        'has_automation',
        'timezone',
    ];
    
    protected $appends = ['company', 'agency', 'campaigns'];
    
    public function agencies() {
        return $this->belongsToMany('App\Models\Agency', 'agency_companies', 'id', 'agency_id', 'agency_company_id', 'id');
    }

    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'agency_companies', 'id', 'company_id', 'agency_company_id', 'id');
    }
    
    public function campaigns() {
        return $this->hasMany('App\Models\DealCampaign', 'deal_id', 'id');
    }

    public function actions() {
        return $this->hasMany('App\Models\DealAction', 'deal_id', 'id');
    }
    
    public function getCompanyAttribute() {
        $company = $this->companies()->first();
        if ($company) {
            return $company->only('name', 'avatar_path', 'id');
        }
        return $company;
    }
  
    public function getAgencyAttribute() {
        $agency = $this->agencies()->first();
        if ($agency) {
            return $agency->only('name', 'avatar_path', 'id');
        }
        return $agency;
    }

    public function getCampaignsAttribute() {
        $campaigns = $this->campaigns()->get();
        if ($campaigns) {
            return collect($campaigns)->map(function ($campaign) {
                return $campaign->only(['name', 'id', 'integration', 'agents']);
            });
        }
        return $campaigns;
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
            COUNT(DISTINCT leads.id) as leads_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(leadNotes.created_at, leads.created_at)))) AS avg_time_response
        ');
        $query->groupBy('deal_campaigns.id');
        
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
