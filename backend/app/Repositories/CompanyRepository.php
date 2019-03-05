<?php
namespace App\Repositories;

use App\Models\Company;
use App\Models\Lead;
use Carbon\Carbon;

trait CompanyRepository {
    public function createCompany($data) {
        $data['role'] = Company::$ROLE_COMPANY;
        return $this->createUser($data);
    }

    public function getAgentBy($agentId) {
        return $this->agents()->where('agent_id', $agentId)->firstOrFail();
    }
    
    public function getDealBy($dealId) {
        return $this->deals()->where('deals.id', $dealId)->firstOrFail();
    }

    public function getLeadBy($leadId) {
        return $this->leads()->where('leads.id', $leadId)->firstOrFail();
    }

    public static function contactedLeadsGraph(
        $startDate,
        $endDate,
        $companyAgencyId = null,
        $agentId = null, $format = 'Y-m-d') {
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
            ->join('lead_notes AS ln', 'ln.lead_id', 'leads.id')
            ->join('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
            ->where(function ($query) {
                $query
                    ->where('ls.type', 'CONTACTED_SMS')
                    ->orWhere('ls.type', 'CONTACTED_CALL')
                    ->orWhere('ls.type', 'CONTACTED_EMAIL')
                ;
            })
            ->groupBy('creation_date')
            ->whereBetween('leads.created_at', [
                Carbon::createFromFormat('Y-m-d', $startDate),
                Carbon::createFromFormat('Y-m-d', $endDate)]);
        
        if ($companyAgencyId) {
            $query->where('leads.agency_company_id', $companyAgencyId);
        }
        
        if ($agentId) {
            $query->where('leads.agent_id', $agentId);
        }
        $averageResponseTime = static::getAverageTime($startDate, $endDate, $companyAgencyId, $agentId, $format);
       return static::mapLeadsData($query->get(), $averageResponseTime, $startDate, $endDate, $format);
    }
    
    static function getAverageTime( $startDate,
                                    $endDate,
                                    $companyAgencyId = null,
                                    $agentId = null, $format = 'Y-m-d') {
        $query = Lead::selectRaw(
          "sec_to_time(AVG(time_to_sec(timediff(ln.created_at, leads.created_at)))) as avg_time")
            ->join('lead_notes AS ln', 'ln.lead_id', 'leads.id')
            ->join('lead_statuses AS ls', 'ls.id', 'ln.lead_status_id')
            ->where(function ($query) {
                $query
                    ->where('ls.type', 'CONTACTED_SMS')
                    ->orWhere('ls.type', 'CONTACTED_CALL')
                    ->orWhere('ls.type', 'CONTACTED_EMAIL')
                ;
            })
            ->whereBetween('leads.created_at', [
                Carbon::createFromFormat('Y-m-d', $startDate),
                Carbon::createFromFormat('Y-m-d', $endDate)]);
    
        if ($companyAgencyId) {
            $query->where('leads.agency_company_id', $companyAgencyId);
        }
    
        if ($agentId) {
            $query->where('leads.agent_id', $agentId);
        }
        return $query->first();
    }
    
    static public function mapLeadsData($leads, $averageResponseTime, $startDate, $endDate, $format = 'Y-m-d') {
        $interval = new \DateInterval('P1D');
        $dateRange = new \DatePeriod(new \DateTime($startDate), $interval , new \DateTime($endDate));
    
        $dateCollection = collect($dateRange)->map(function ($date) use ($format) {
            return $date->format($format);
        });

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
                "label" => '12 hrs + Missed leads',
                "data" => '12plus',
                "backgroundColor" => ['rgba(0, 0, 0, 0)'],
                "borderColor" => ['#db2828'],
                "borderWidth" => 2,
            ]
        ];
    
    
        $datasets = collect($datasets)->map(function ($dataset) use ($leads, $dateCollection) {
            $fieldName = $dataset['data'];
            $dataset['data'] = collect($dateCollection)->map(function ($date) use ($leads, $fieldName) {
                return  (int)$leads->where('creation_date', $date)->first()[$fieldName];
            });
            return $dataset;
        });
    
    
        return [
            'avg_response_time' => ($averageResponseTime->avg_time ? $averageResponseTime->avg_time : '00:00:00'),
            'labels' => $dateCollection,
            'datasets' => $datasets
        ];
    }
}