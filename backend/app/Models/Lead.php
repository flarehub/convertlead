<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'fullname',
        'email',
        'phone',
        'metadata',
    ];
    
    protected $appends = [
        'campaign',
        'status',
        'company',
        'agents'
    ];
    
    public function campaign() {
        return $this->hasOne('App\Models\DealCampaign', 'id', 'deal_campaign_id');
    }
    
    public function company() {
        return $this->hasOne('App\Models\Company', 'id', 'company_id');
    }
    
    public function agents() {
        return $this->belongsToMany('App\Models\Agent', 'deal_campaign_agents', 'deal_campaign_id');
    }

    public function status() {
        return $this->hasOne('App\Models\LeadStatus', 'id', 'lead_status_id');
    }
    
    public function getCampaignAttribute() {
        $company = $this->campaign()->first();
        if ($company) {
            return $company->only(['id', 'name', 'uuid', 'description']);
        }
        return null;
    }

    public function getCompanyAttribute() {
        $company = $this->company()->first();
        if ($company) {
            return $company->only(['id', 'name', 'email', 'avatar_path']);
        }
        return null;
    }

    public function getAgentsAttribute() {
        $agents = $this->agents()->get();
        if ($agents) {
            return collect($agents)->map(function ($agent) {
                return $agent->only(['id', 'name', 'avatar_path']);
            });
        }
        return null;
    }

    public function getStatusAttribute() {
        $status = $this->status()->first();
        if ($status) {
            return $status->type;
        }
        return LeadStatus::$STATUS_NEW;
    }
}
