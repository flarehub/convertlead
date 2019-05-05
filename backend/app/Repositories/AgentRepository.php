<?php

namespace App\Repositories;

use App\Models\Agency;
use App\Models\Company;
use App\Models\Lead;
use Carbon\Carbon;
use DB;

trait AgentRepository
{
    public function createAgent($data)
    {
        $data['role'] = Company::$ROLE_AGENT;
        return $this->createUser($data);
    }

    public static function contactedLeadsGraph(
        $startDate,
        $endDate,
        $agentId,
        $companyAgencyIds = null,
        $format = 'Y-m-d', $pieGraph = false)
    {
        $query = Lead::selectRaw(
            "
          DATE(leads.created_at) as creation_date,
	   SUM(time_to_sec(timediff(ln.created_at, leads.created_at)) <= (15*60)) as up15Minutes,
             SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (15*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (30*60)
       ) as up30Mintes,
       SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (30*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (2*60*60)
       ) as up2Hours,
       SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (2*60*60) AND time_to_sec(timediff(ln.created_at, leads.created_at)) <= (12*60*60)
       ) as up12Hours,
            SUM(
       time_to_sec(timediff(ln.created_at, leads.created_at)) >= (12*60*60)) as 12plus
     
            ")
            ->join(DB::raw('(SELECT ln1.lead_id as lead_id, Min(ln1.created_at) as created_at FROM lead_notes as ln1 
                    JOIN lead_statuses as ls ON ln1.lead_status_id=ls.id
                    WHERE ls.type="CONTACTED_SMS" or ls.type="CONTACTED_CALL" or ls.type="CONTACTED_EMAIL"
                    group by ln1.lead_id) AS ln'),
                function($join) {
                    $join->on('ln.lead_id', '=', 'leads.id');
                })
//            ->join('lead_notes AS ln', 'ln.lead_id', 'leads.id')
//            ->join('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
//            ->where(function ($query) {
//                $query
//                    ->where('ls.type', 'CONTACTED_SMS')
//                    ->orWhere('ls.type', 'CONTACTED_CALL')
//                    ->orWhere('ls.type', 'CONTACTED_EMAIL');
//            })
            ->groupBy('creation_date')
            ->whereBetween('leads.created_at', [
                Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay(),
                Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay()]);

        $query->where('leads.agent_id', $agentId);


        if ($companyAgencyIds) {
            $query->whereIn('leads.agency_company_id', $companyAgencyIds);
        }


        $averageResponseTime = static::getAverageTime($startDate, $endDate, $companyAgencyIds, $agentId, $format);


        if ($pieGraph) {
            return static::mapLeadsToPieGraph($query->get(), $averageResponseTime, $startDate, $endDate, $format);
        }
        return static::mapLeadsToLineGraph($query->get(), $averageResponseTime, $startDate, $endDate, $format);
    }

    static function getAverageTime($startDate,
                                   $endDate,
                                   $companyAgencyIds = null,
                                   $agentId = null, $format = 'Y-m-d')
    {
        $query = Lead::selectRaw(
            "sec_to_time(AVG(time_to_sec(timediff(ln.created_at, leads.created_at)))) as avg_time")
            ->join('lead_notes AS ln', 'ln.lead_id', 'leads.id')
            ->join('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
            ->where(function ($query) {
                $query
                    ->where('ls.type', 'CONTACTED_SMS')
                    ->orWhere('ls.type', 'CONTACTED_CALL')
                    ->orWhere('ls.type', 'CONTACTED_EMAIL');
            })
            ->whereBetween('leads.created_at', [
                Carbon::createFromFormat($format, $startDate)->startOfDay(),
                Carbon::createFromFormat($format, $endDate)->endOfDay()]);

        if ($companyAgencyIds) {
            $query->whereIn('leads.agency_company_id', $companyAgencyIds);
        }

        $query->where('leads.agent_id', $agentId);

        return $query->first();
    }

    static public function mapLeadsToLineGraph($leads, $averageResponseTime, $startDate, $endDate, $format = 'Y-m-d')
    {
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod(new \DateTime($startDate), $interval, new \DateTime($endDate));

        $dateCollection = collect($dateRange)->map(function ($date) use ($format) {
            return $date->format($format);
        });
        $dateCollection[] = $endDate;

        $datasets = [
            [
                "label" => '15 min (0-15)',
                "data" => 'up15Minutes',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#21ba45'],
                "borderWidth" => 2,
            ],
            [
                "label" => '30 min (15-30)',
                "data" => 'up30Mintes',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#f2711c'],
                "borderWidth" => 2,
            ],
            [
                "label" => '2 hrs (30-2)',
                "data" => 'up2Hours',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#2cb3c8'],
                "borderWidth" => 2,
            ],
            [
                "label" => '12 hrs (2-12)',
                "data" => 'up12Hours',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#6435c9'],
                "borderWidth" => 2,
            ],
            [
                "label" => '12 hrs + Missed',
                "data" => '12plus',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#db2828'],
                "borderWidth" => 2,
            ]
        ];


        $datasets = collect($datasets)->map(function ($dataset) use ($leads, $dateCollection) {
            $fieldName = $dataset['data'];
            $dataset['data'] = collect($dateCollection)->map(function ($date) use ($leads, $fieldName) {
                return (int)$leads->where('creation_date', $date)->first()[$fieldName];
            });
            return $dataset;
        });


        return [
            'avg_response_time' => ($averageResponseTime->avg_time ? $averageResponseTime->avg_time : '00:00:00'),
            'labels' => $dateCollection,
            'datasets' => $datasets
        ];
    }

    static public function mapLeadsToPieGraph($leads, $averageResponseTime, $startDate, $endDate, $format = 'Y-m-d')
    {
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod(new \DateTime($startDate), $interval, new \DateTime($endDate));

        $dateCollection = collect($dateRange)->map(function ($date) use ($format) {
            return $date->format($format);
        });
        $dateCollection[] = $endDate;
        $labels = ['15 min (0-15)', '30 min (15-30)', '2 hrs (30-2)', '12 hrs (2-12)', '12 hrs + Missed'];
        $backGroundColors = ['#21ba45', '#f2711c', '#2cb3c8', '#6435c9', '#db2828'];

        $datasets = [
            'backgroundColor' => $backGroundColors,
            'data' => [
                'up15Minutes',
                'up30Mintes',
                'up2Hours',
                'up12Hours',
                '12plus',
            ]
        ];


        $datasets['data'] = collect($datasets['data'])->map(function ($fieldName) use ($leads, $dateCollection) {
            return collect($leads)->reduce(function ($acc, $lead) use ($leads, $fieldName) {
                return $acc + (int)$lead[$fieldName];
            });
        });


        return [
            'avg_response_time' => ($averageResponseTime->avg_time ? $averageResponseTime->avg_time : '00:00:00'),
            'labels' => $labels,
            'datasets' => [
                $datasets
            ],
        ];
    }
}