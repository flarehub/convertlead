<?php

namespace App\Models;

use App\Repositories\AgencyRepository;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agency extends User
{
    use AgencyRepository, SoftDeletes;

    public function agencyCompaniesBy($companyId) {
        return $this->belongsTo('App\Models\AgencyCompanyPivot', 'id')->where('company_id', $companyId)->get();
    }
    
    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'agency_companies', 'agency_id')->withPivot('id');
    }

    public function agents() {
        return $this->hasMany('App\Models\Agent', 'agent_agency_id', 'id');
    }
    
    public function deals() {
        return $this->belongsToMany(
            'App\Models\Deal',
            'agency_companies',
            'agency_id',
            'id',
            'id',
            'agency_company_id');
    }
    
    public function getCompanyDeals() {
        return $this
            ->deals()
            ->join('users as company', 'company.id', '=', 'company_id')
            ->whereRaw('company.deleted_at IS NULL');
    }
    
    public function getCompanies($queryParams) {
        $query = Company::selectRaw('
            users.id,
            users.name,
            users.phone,
            users.email,
            users.avatar_id,
            ac.is_locked,
            IF(users.deleted_at IS NOT NULL, 1, 0) AS is_deleted,
            COUNT(DISTINCT users.id, deals.id) as deals_count,
            COUNT(DISTINCT users.id, company_agents.id) as agents_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF((SELECT MIN(created_at) FROM lead_notes as ld WHERE ld.lead_id = leads.id), leads.created_at)))) AS avg_lead_response
            ')
            ->join('agency_companies as ac', 'ac.company_id', 'users.id')
            ->join('users AS ag', 'ag.id', 'ac.agency_id')
            ->leftJoin('deals', 'deals.agency_company_id', 'ac.id')
            ->leftJoin('company_agents', 'company_agents.company_id', 'users.id')
            ->leftJoin('leads', 'leads.agency_company_id', 'ac.id')
            ->leftJoin('lead_notes', 'lead_notes.lead_id', 'leads.id')
            ->where('ag.id', $this->id)->groupBy('users.id', 'ac.is_locked');
        
        if ( isset($queryParams['showDeleted']) ) {
            $query->withTrashed();
        } else {
            $query->whereRaw('users.deleted_at IS NULL');
        }
    
        if ( isset($queryParams['search']) && $queryParams['search'] ) {
            $query->where(function ($query) use ($queryParams) {
                $query
                    ->where('users.name', 'like', "%{$queryParams['search']}%")
                    ->orWhere('users.email', 'like', "%{$queryParams['search']}%");
            });
        }
        
        if ( isset($queryParams['name']) ) {
            $query->orderBy('users.name', ($queryParams['name'] === 'true' ? 'DESC' : 'ASC'));
        }
    
    
        if ( isset($queryParams['deals']) ) {
            $query->orderBy('deals_count', $queryParams['deals'] === 'true' ? 'DESC' : 'ASC');
        }

        if ( isset($queryParams['leads']) ) {
            $query->orderBy('leads_count', $queryParams['leads'] === 'true' ? 'DESC' : 'ASC');
        }

        if ( isset($queryParams['agents']) ) {
            $query->orderBy('agents_count', $queryParams['agents'] === 'true' ? 'DESC' : 'ASC');
        }
        if ( isset($queryParams['avg_response']) ) {
            $query->orderBy('avg_lead_response', $queryParams['avg_response'] === 'true' ? 'DESC' : 'ASC');
        }

        return $query;
    }
    
    public function getAgents($queryParams = []) {
        $query = Agent::selectRaw
        (
            'users.agent_agency_id, users.id, users.role, users.name, users.email, users.phone, users.avatar_id,
            SUM((SELECT COUNT(id)
                    FROM deal_campaigns AS dc
                    WHERE dc.id = dca.deal_campaign_id GROUP BY dc.id
                    )) AS campaigns_count,
             SUM((SELECT COUNT(id)
                FROM leads
                WHERE leads.deal_campaign_id = dca.deal_campaign_id GROUP BY leads.deal_campaign_id
                )) AS leads_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(
            ld.created_at,
            (
                SELECT created_at
                    FROM lead_notes
                    WHERE lead_notes.lead_id = ld.id ORDER BY created_at ASC LIMIT 1))))) AS avg_lead_response,
            users.created_at'
        )
            ->join('users as agency', 'agency.id', 'users.agent_agency_id')
            ->leftJoin('company_agents AS ca', 'ca.agent_id', 'users.id')
            ->leftJoin('deal_campaign_agents as dca', 'dca.agent_id', 'users.id')
            ->leftJoin('leads AS ld', 'ld.deal_campaign_id', 'dca.deal_campaign_id')
            ->where('agency.id', $this->id)
            ->groupBy('users.id');
    
        if ( isset($queryParams['showDeleted']) ) {
            $query->withTrashed();
        }
        
        if (isset($queryParams['companyId'])) {
            $query->where('ca.company_id', $queryParams['companyId']);
        }

        if (isset($queryParams['search'])) {
            $query->where(function ($query) use ($queryParams) {
                $query
                    ->where('users.name', 'LIKE', "%{$queryParams['search']}%")
                    ->orWhere('users.email', 'LIKE', "%{$queryParams['search']}%");
            });
        }

        if ( isset($queryParams['name']) ) {
            $query->orderBy('users.name', ($queryParams['name'] === 'true' ? 'DESC' : 'ASC'));
        }

        if ( isset($queryParams['campaigns']) ) {
            $query->orderBy('campaigns_count', $queryParams['campaigns'] === 'true' ? 'DESC' : 'ASC');
        }

        if ( isset($queryParams['leads']) ) {
            $query->orderBy('leads_count', $queryParams['leads'] === 'true' ? 'DESC' : 'ASC');
        }

        if ( isset($queryParams['avg_response']) ) {
            $query->orderBy('avg_lead_response', $queryParams['avg_response'] === 'true' ? 'DESC' : 'ASC');
        }
        return $query;
    }
    
    public function getLeads($queryParams = []) {
        $query = Lead::selectRaw('leads.*, ac.company_id, ac.agency_id, dc.deal_id')
            ->join('agency_companies AS ac', 'ac.id', 'leads.agency_company_id')
            ->join('users as cp', 'cp.id', 'ac.company_id')
            ->join('lead_statuses as ls', 'ls.id', 'leads.lead_status_id')
            ->join('deal_campaigns as dc', 'dc.id', 'leads.deal_campaign_id')
            ->where('ac.agency_id', $this->id)
        ;

        if (isset($queryParams['search'])) {
            $query->where(function ($query) use ($queryParams) {
                $query
                    ->where('leads.fullname', 'like', "%{$queryParams['search']}%")
                    ->orWhere('leads.email', 'like', "%{$queryParams['search']}%")
                    ->orWhere('leads.phone', 'like', "%{$queryParams['search']}%")
                ;
            });
        }
        
        if (isset($queryParams['companyId']) && $queryParams['companyId']) {
            $query->where('ac.company_id', $queryParams['companyId']);
        }

        if (isset($queryParams['statusType']) && $queryParams['statusType']) {
            $query->where('ls.type', $queryParams['statusType']);
        }
    
        if ( isset($queryParams['showDeleted']) ) {
            $query->withTrashed();
        }
    
        if ( isset($queryParams['name']) ) {
            $query->orderBy('leads.fullname', ($queryParams['name'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        if ( isset($queryParams['email']) ) {
            $query->orderBy('leads.email', ($queryParams['email'] === 'true' ? 'DESC' : 'ASC'));
        }

        if ( isset($queryParams['company']) ) {
            $query->orderBy('cp.name', ($queryParams['company'] === 'true' ? 'DESC' : 'ASC'));
        }
        if ( isset($queryParams['campaign']) ) {
            $query->orderBy('dc.name', ($queryParams['campaign'] === 'true' ? 'DESC' : 'ASC'));
        }
    
        return $query;
    }
}