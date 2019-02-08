<?php

namespace App\Models;

use App\Repositories\CompanyRepository;

class Company extends User
{
    use CompanyRepository;
    
    protected $appends = ['avatar_path'];

    public function agencies() {
        return $this->belongsToMany('App\Models\Agency', 'users', 'agency_companies', 'company_id');
    }
    
    public function agents() {
        return $this->belongsToMany('App\Models\Agent', 'company_agents', 'company_id');
    }
    
    public function deals() {
        return $this->belongsToMany('App\Models\Deal', 'agency_companies', 'company_id', 'id', 'id', 'agency_company_id');
    }
}
