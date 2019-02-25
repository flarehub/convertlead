<?php

namespace App\Models;

use App\Repositories\AgentRepository;
use Illuminate\Database\Eloquent\SoftDeletes;

class Agent extends User
{
    use AgentRepository, SoftDeletes;
    
    protected $appends = ['avatar_path', 'permissions', 'company', 'companies'];
    
    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'company_agents', 'agent_id');
    }
    
    public function getCompanyAttribute() {
        if ($this->company_id) {
            $company = Company::withTrashed()->find($this->company_id);
            return ($company ? $company->only(['name', 'email', 'avatar_path']) : null);
        }
        return null;
    }

    public function getCompaniesAttribute() {
        $companies = $this->companies()->get();
        if ($companies) {
            return collect($companies)->map(function ($company)  {
                return $company->only(['id', 'name', 'email', 'avatar_path']);
            });
        }
        return null;
    }
}
