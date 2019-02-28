<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'agency_company_id',
        'deal_campaign_id',
        'agent_id',
        'lead_status_id',
        'fullname',
        'email',
        'phone',
        'metadata',
    ];
    
    protected $appends = [
        'campaign',
        'status',
        'company',
        'agent'
    ];
    
    public function campaign() {
        return $this->hasOne('App\Models\DealCampaign', 'id', 'deal_campaign_id');
    }
    
    public function company() {
        return $this->hasOne('App\Models\Company', 'id', 'company_id');
    }
    
    public function agent() {
        return $this->hasOne('App\Models\Agent', 'id', 'agent_id');
    }

    public function status() {
        return $this->hasOne('App\Models\LeadStatus', 'id', 'lead_status_id');
    }
    
    public function getCampaignAttribute() {
        $company = $this->campaign()->withTrashed()->first();
        if ($company) {
            return $company->only(['id', 'name', 'uuid', 'description']);
        }
        return null;
    }

    public function getCompanyAttribute() {
        $company = $this->company()->withTrashed()->first();
        if ($company) {
            return $company->only(['id', 'name', 'email', 'avatar_path']);
        }
        return null;
    }

    public function getAgentAttribute() {
        $agent = $this->agent()->withTrashed()->first();
        if ($agent) {
            return $agent->only(['id', 'name', 'avatar_path']);
        }
        return null;
    }

    public function getStatusAttribute() {
        $status = $this->status()->withTrashed()->first();
        if ($status) {
            return $status->type;
        }
        return LeadStatus::$STATUS_NEW;
    }
}
