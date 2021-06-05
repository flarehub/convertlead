<?php

namespace App\Models;

use App\Repositories\AgencyRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agency extends User
{
    use AgencyRepository, SoftDeletes;

    public function agencyCompaniesBy($companyId) {
        return $this->belongsTo('App\Models\AgencyCompanyPivot', 'id')->where('company_id', $companyId)->get();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'agency_companies', 'agency_id')->withPivot('id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function agents() {
        return $this->hasMany('App\Models\Agent', 'agent_agency_id', 'id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function deals() {
        return $this->belongsToMany(
            'App\Models\Deal',
            'agency_companies',
            'agency_id',
            'id',
            'id',
            'agency_company_id');
    }
    
    public function getCompanies($queryParams) {
        switch (isset($queryParams['reduced']) && $queryParams['reduced']) {
            case true: {
                return $this->getReducedCompaniesDetails($queryParams);
            }
            default: {
                return $this->getCompaniesWithStats($queryParams);
            }
        }
    }

    /**
     * @param $queryParams
     * @return Company|\Illuminate\Database\Query\Builder
     */
    public function getCompaniesWithStats($queryParams) {
        $query = Company::selectRaw('
            DISTINCT users.id,
            users.name,
            users.phone,
            users.email,
            users.avatar_id,
            users.twilio_sid,
            users.twilio_token,
            users.twilio_mobile_number,
            agency_companies.is_locked,
            IF(users.deleted_at IS NOT NULL, 1, 0) AS is_deleted,
            COUNT(DISTINCT users.id, deals.id) as deals_count,
            COUNT(DISTINCT users.id, leads.id) as leads_count,
            COUNT(DISTINCT users.id, company_agents.id) as agents_count,
            SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(leadNotes.created_at, leads.created_at)))) AS avg_lead_response,
            GROUP_CONCAT(DISTINCT ua.name) agents_name
            ')
            ->join('agency_companies', 'agency_companies.company_id', 'users.id')
            ->leftJoin('deals', 'deals.agency_company_id', 'agency_companies.id')
            ->leftJoin('company_agents', 'company_agents.company_id', 'users.id')
            ->leftJoin('users AS ua', 'ua.id', 'company_agents.agent_id')
            ->leftJoin('leads', 'leads.agency_company_id', 'agency_companies.id')
            ->leftJoin(\DB::raw("
            (SELECT lead_notes.lead_id, MIN(lead_notes.created_at) AS created_at
                          FROM lead_notes JOIN lead_statuses ON lead_statuses.id = lead_notes.lead_status_id
                          WHERE
                              lead_statuses.type = 'CONTACTED_SMS' OR
                              lead_statuses.type = 'CONTACTED_CALL' OR
                              lead_statuses.type = 'CONTACTED_EMAIL' GROUP BY lead_notes.lead_id) AS leadNotes
                          "), function ($join) {
                $join->on('leadNotes.lead_id', '=', 'leads.id');
            })
            ->where('agency_companies.agency_id', $this->id)
            ->groupBy('agency_companies.company_id', 'agency_companies.is_locked');

        $query->with('agents');

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
            $query->orderBy('agents_name', $queryParams['agents'] === 'true' ? 'DESC' : 'ASC');
        }

        if ( isset($queryParams['avg_response']) ) {
            $query->orderBy('avg_lead_response', $queryParams['avg_response'] === 'true' ? 'DESC' : 'ASC');
        }

        return $query;
    }
    
    public function getAgents($queryParams = []) {
        $query = Agent::selectRaw
        (
            'users.agent_agency_id, users.id, users.role, users.name, users.email,
             users.phone,
             users.twilio_mobile_number,
              users.avatar_id,
            COUNT(DISTINCT dca.id) AS campaigns_count,
            COUNT(DISTINCT dc.id, dca.id) AS deal_campaigns_count,
             COUNT(DISTINCT ld.id) AS leads_count,
                SEC_TO_TIME(AVG(TIME_TO_SEC(TIMEDIFF(leadNotes.created_at, ld.created_at)))) AS avg_lead_response,
            users.created_at,
            users.deleted_at
            '
        )
            ->join('users as agency', 'agency.id', 'users.agent_agency_id')
            ->leftJoin('company_agents AS ca', 'ca.agent_id', 'users.id')
            ->leftJoin('deal_campaigns as dc', 'dc.agency_company_id', 'ca.company_id')
            ->leftJoin('deal_campaign_agents as dca', 'dca.agent_id', 'users.id')
            ->leftJoin('leads AS ld', 'ld.agent_id', 'users.id')
            ->leftJoin(\DB::raw("
            (SELECT lead_notes.lead_id, MIN(lead_notes.created_at) AS created_at
                          FROM lead_notes JOIN lead_statuses ON lead_statuses.id = lead_notes.lead_status_id
                          WHERE
                              lead_statuses.type = 'CONTACTED_SMS' OR
                              lead_statuses.type = 'CONTACTED_CALL' OR
                              lead_statuses.type = 'CONTACTED_EMAIL' GROUP BY lead_notes.lead_id) AS leadNotes
                          "), function ($join) {
                $join->on('leadNotes.lead_id', '=', 'ld.id');
            })
            ->where('agency.id', $this->id)
            ->groupBy('users.id');
    
        if ( isset($queryParams['showDeleted']) ) {
            $query->withTrashed();
        }
        
        if (isset($queryParams['companyId']) && $queryParams['companyId']) {
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
    
    public function getLeads($queryParams = [], $format = 'Y-m-d') {
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

        if (
        (isset($queryParams['startDate']) && $queryParams['startDate']) &&
        (isset($queryParams['endDate']) && $queryParams['endDate'])
        ) {
            $query->whereBetween('leads.created_at', [
                Carbon::createFromFormat($format, $queryParams['startDate'])->startOfDay(),
                Carbon::createFromFormat($format, $queryParams['endDate'])->endOfDay()]);
        }
        

        if (isset($queryParams['agentId']) && $queryParams['agentId']) {
            $query->where('leads.agent_id', $queryParams['agentId']);
        }

        if (isset($queryParams['campaignId']) && $queryParams['campaignId']) {
            $query->where('dc.id', $queryParams['campaignId']);
        }

        if (isset($queryParams['statusType']) && $queryParams['statusType']) {
            $query->where('ls.type', $queryParams['statusType']);
        }
    
        if ( isset($queryParams['showDeleted']) ) {
            $query->withTrashed();
            $query->whereRaw('leads.deleted_at IS NOT NULL');
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
    
    /**
     * @param $queryParams
     * @return mixed
     */
    public function getReducedCompaniesDetails($queryParams)
    {
        $query =
            $this->companies()
            ->leftJoin('company_agents', 'company_agents.company_id', 'users.id')
        ;
        
        if (isset($queryParams['search']) && $queryParams['search']) {
            $query->where(function ($query) use ($queryParams) {
                $query
                    ->where('users.name', 'like', "%{$queryParams['search']}%")
                    ->orWhere('users.email', 'like', "%{$queryParams['search']}%");
            });
        }
        
        if (isset($queryParams['name'])) {
            $query->orderBy('users.name', ($queryParams['name'] === 'true' ? 'DESC' : 'ASC'));
        }

        if (isset($queryParams['agentId']) && $queryParams['agentId']) {
            $query->where('company_agents.agent_id', $queryParams['agentId']);
        }
        $query->groupBy('users.id', 'agency_id', 'agency_companies.id');
        return $query;
    }

    public static function getMaxCompaniesCanCreateBy($subscriptionType) {
        $subscriptions = [
            static::$SUBSCRIPTION_TYPE_BASE => env('APP_BASE_AGENCY_MAX_COMPANIES', 5),
            static::$SUBSCRIPTION_TYPE_PREMIUM => env('APP_PREMIUM_AGENCY_MAX_COMPANIES', 10),
        ];
        return isset($subscriptions[$subscriptionType]) ? $subscriptions[$subscriptionType] : 0;
    }
}
