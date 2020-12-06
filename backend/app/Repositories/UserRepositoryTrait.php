<?php

namespace App\Repositories;

use App\Models\DealCampaign;
use App\Models\Lead;
use Illuminate\Http\Request;

/**
 * Trait UserRepositoryTrait
 * @package App\Repositories
 */
trait UserRepositoryTrait {

    /**
     * @param \Request $request
     * @return mixed
     */
    public function getCompanyDeals(Request $request) {
        $query =  $this
            ->deals()
            ->join('users AS company', 'company.id', '=', 'company_id')
            ->leftJoin('deal_campaigns AS dc', 'dc.deal_id', '=', 'deals.id')
            ->leftJoin('leads', 'leads.deal_campaign_id', '=', 'dc.id')
            ->leftJoin('lead_notes AS ln', 'ln.lead_id', '=', 'leads.id')
            ->whereRaw('company.deleted_at IS NULL');

        if ($request->has('search')) {
            $query->whereLike('deals.name', "%{$request->get('search')}%");
        }

        if ($request->has('companyId')) {
            $query->where('company.id', $request->get('companyId'));
        }

        if ($request->has('sortBy')) {
            [$field, $direction] = explode('.', $request->get('sortBy', ''));
            $query->sortBy($field, $direction);
        }

        $query->groupBy('deals.id')
            ->selectRaw('count(DISTINCT leads.id) AS leadsCount, count(DISTINCT ln.id) as leadNoteCount')
            ->withTrashed();

        return $query;
    }

    public function getDealsStatistics(Request $request)
    {
        $query = Lead::query()
            ->join('deal_campaigns AS dc', 'dc.id', '=', 'leads.deal_campaign_id')
            ->join('agency_companies AS ac', 'ac.id', '=', 'dc.agency_company_id');

        if ($request->has('dealIds')) {
            $query->whereIn('dc.deal_id', $request->get('dealIds'));
        }

        $fromDate = $request->has('fromDate');
        $toDate = $request->has('toDate');

        if ($fromDate && $toDate) {
            $query->whereBetween('leads.created_at', [$fromDate, $toDate]);
        }

        $query
            ->selectRaw('
                DATE(leads.created_at) AS created_date,
                 COUNT(DISTINCT leads.id) as leadsCount,
                 COUNT(DISTINCT dc.integration) as integrationCount,
                 dc.integration
            ')
            ->groupBy(['created_date, dc.integration']);

        return $query->get();
    }
}
