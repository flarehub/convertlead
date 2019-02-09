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
    
    public function getCompanies($filters) {
        $query = self::selectRaw('
            cp.id,
            cp.name,
            IF(cp.deleted_at IS NOT NULL, 1, 0) AS is_deleted,
            COUNT(DISTINCT cp.id, deals.id) as deals_count,
            COUNT(DISTINCT cp.id, company_agents.id) as agents_count,
            COUNT(DISTINCT cp.id, leads.id) as leads_count,
               SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(
                leads.created_at,
                (
                    SELECT created_at
                        FROM lead_notes
                        WHERE lead_notes.lead_id = leads.id ORDER BY created_at ASC LIMIT 1))))) AS avg_lead_response
            ')
            ->join('agency_companies', 'users.id', 'agency_companies.agency_id')
            ->join('users AS cp', 'cp.id', 'agency_companies.company_id')
            ->leftJoin('deals', 'deals.agency_company_id', 'agency_companies.id')
            ->leftJoin('company_agents', 'company_agents.company_id', 'cp.id')
            ->leftJoin('leads', 'leads.company_id', 'cp.id')
            ->where('users.id', $this->id)->groupBy('cp.id');
        
        if ( isset($filters['showDeleted']) ) {
            $query->whereRaw('(cp.deleted_at IS NOT NULL OR cp.deleted_at IS NULL)');
        } else {
            $query->whereRaw('cp.deleted_at IS NULL');
        }
    
        if ( $filters['search'] ) {
            $query->where(function ($query) use ($filters) {
                $query
                    ->where('cp.name', 'like', "%{$filters['search']}%")
                    ->orWhere('cp.email', 'like', "%{$filters['search']}%");
            });
        }
        
        if ( isset($filters['name']) ) {
            $query->orderBy('cp.name', ($filters['name'] === 'true' ? 'desc' : 'asc'));
        }
    
    
        if ( isset($filters['deals']) ) {
            $query->orderBy('deals_count', $filters['deals'] === 'true' ? 'desc' : 'asc');
        }
    
        if ( isset($filters['leads']) ) {
            $query->orderBy('leads_count', $filters['deals'] === 'true' ? 'desc' : 'asc');
        }

        if ( isset($filters['agents']) ) {
            $query->orderBy('agents_count', $filters['agents'] === 'true' ? 'desc' : 'asc');
        }
        if ( isset($filters['avg_response']) ) {
            $query->orderBy('avg_lead_response', $filters['avg_response'] === 'true' ? 'desc' : 'asc');
        }
        
        return $query;
    }
    
    public function getAgents($filters = []) {
        $query = Agent::selectRaw
        (
            'users.id, users.role, users.name,
            (SELECT COUNT(id)
                    FROM deal_campaigns AS dc
                    WHERE dc.id = dca.deal_campaign_id AND dc.company_id = ca.company_id
                    ) AS campaigns_count,
            (SELECT COUNT(id)
                    FROM leads
                    WHERE leads.deal_campaign_id = dca.deal_campaign_id AND leads.company_id = ca.company_id GROUP BY leads.id
                    ) AS leads_count,
           SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(
                ld.created_at,
                (
                    SELECT created_at
                        FROM lead_notes
                        WHERE lead_notes.lead_id = ld.id ORDER BY created_at ASC LIMIT 1))))) AS avg_lead_response,
            users.created_at,
            ac.company_id'
        )
            ->join('company_agents as ca','ca.agent_id', 'users.id')
            ->join('agency_companies as ac', 'ac.company_id', 'ca.company_id')
            ->join('users as agency', 'agency.id', 'ac.agency_id')
            ->join('users as company', 'company.id', 'ca.company_id')
            ->leftJoin('deal_campaign_agents as dca', 'dca.agent_id', 'users.id')
            ->leftJoin('leads AS ld', 'ld.deal_campaign_id', 'dca.deal_campaign_id')
            ->where('agency.id', $this->id)
            ->groupBy('users.id', 'ac.company_id', 'dca.deal_campaign_id');
    
        if ( isset($filters['showDeleted']) ) {
            $query->whereRaw('(users.deleted_at IS NOT NULL OR users.deleted_at IS NULL)');
        } else {
            $query->whereRaw('users.deleted_at IS NULL');
        }
        
        if (isset($filters['search'])) {
            $query->where(function ($query) use ($filters) {
                $query
                    ->where('users.name', 'like', "%{$filters['search']}%")
                    ->orWhere('users.email', 'like', "%{$filters['search']}%");
            });
        }

        if ( isset($filters['name']) ) {
            $query->orderBy('users.name', ($filters['name'] === 'true' ? 'desc' : 'asc'));
        }

        if ( isset($filters['campaigns']) ) {
            $query->orderBy('campaigns_count', $filters['campaigns'] === 'true' ? 'desc' : 'asc');
        }
    
        if ( isset($filters['leads']) ) {
            $query->orderBy('leads_count', $filters['leads'] === 'true' ? 'desc' : 'asc');
        }

        if ( isset($filters['avg_response']) ) {
            $query->orderBy('avg_lead_response', $filters['avg_response'] === 'true' ? 'desc' : 'asc');
        }

  
    
        return $query;
    }
}