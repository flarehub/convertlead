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
    
        return $query;
    }
}
