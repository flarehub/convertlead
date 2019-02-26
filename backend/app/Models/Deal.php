<?php

namespace App\Models;

use App\Repositories\DealRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deal extends Model
{
    use SoftDeletes, DealRepository;

    protected $fillable = [
        'id',
        'name',
        'description',
        'agency_company_id',
    ];
    
    protected $appends = ['company', 'campaigns'];
    
    public function agencies() {
        return $this->belongsToMany('App\Models\Agency', 'agency_companies', 'id', 'agency_id', 'agency_company_id', 'id');
    }

    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'agency_companies', 'id', 'company_id', 'agency_company_id', 'id');
    }
    
    public function campaigns() {
        return $this->hasMany('App\Models\Campaign', 'deal_id', 'id');
    }
    
    public function getCompanyAttribute() {
        $company = $this->companies()->first();
        if ($company) {
            return $company->only('name', 'avatar_path', 'id');
        }
        return $company;
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
        $query = $this->campaigns();
        $query->leftJoin('leads', 'leads.deal_campaign_id', 'deal_campaigns.id');
        $query->leftJoin('lead_notes', 'lead_notes.lead_id', 'leads.id');
        $query->selectRaw('
            deal_campaigns.*,
            COUNT(leads.id) as leads_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF((SELECT MIN(created_at) FROM lead_notes WHERE lead_notes.lead_id = leads.id), leads.created_at)))) AS avg_time_response
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
