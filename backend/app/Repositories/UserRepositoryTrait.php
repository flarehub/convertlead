<?php

namespace App\Repositories;

use App\Models\DealCampaign;
use App\Models\Lead;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
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

        // $fromDate = $request->get('fromDate');
        // $toDate = $request->get('toDate');
        $fromDate = '2019-08-06T21:00:00.000Z';
        $toDate = '2019-08-13T21:00:00.000Z';

        if ($fromDate && $toDate) {
            $query->whereBetween('leads.created_at', [
                "DATE_FORMAT('$fromDate', '%Y-%m-%d %h:%i:%s')",
                "DATE_FORMAT('$toDate', '%Y-%m-%d %h:%i:%s')",
                // "'2001-08-06 00:00:00'",
                // "'2021-08-13 00:00:00'"
            ]);
        }

        $datePeriod = CarbonPeriod::create(
            now()->setTimeFromTimeString($fromDate)->toDateString(),
            now()->setTimeFromTimeString($toDate)->toDateString()
        );

        $query
            ->selectRaw('
                 DATE_FORMAT(leads.created_at, \'%Y/%m/%d\') AS created_date,
                 COUNT(DISTINCT leads.id) as leadsCount,
                 COUNT(DISTINCT dc.integration) as integrationCount,
                 dc.integration
            ')
            ->groupBy(['created_date', 'dc.integration']);

        $leadsStats = $query->get() ?? [];
        $datePeriod = collect($datePeriod)->map(function ($period) {
            return $period->format('Y/m/d');
        })->flip()->map(function ($index, $date) use ($leadsStats) {
            $records = collect($leadsStats)->filter(function ($record) use ($date) {
                return $record->created_date === $date;
            })->map(function ($record) {
                return $record(['leadsCount', 'integrationCount', 'integration', 'created_date']);
            });

            $totalLeadsCount = collect($records)->reduce(function ($collect, $record) {
                $collect += $record['leadsCount'];
                return $collect;
            }, 0);

            return [
                'records' => collect($records)->map(function ($record) use ($totalLeadsCount) {
                    $record['leadsPercentage'] = round((($record['leadsCount'] / $totalLeadsCount) * 100));
                    return $record;
                })->values()->toArray(),
                'totalLeadsCount' => $totalLeadsCount,
                'name' => Carbon::parse($date)->shortDayName,
            ];
        })->values()->toArray();

        $report = [
            'records' => $datePeriod,
            'totalLeadsCount' => collect($leadsStats)->reduce(function ($collect, $record) {
                $collect += $record->leadsCount;
                return $collect;
            }, 0)
        ];

        return $report;
    }
}
