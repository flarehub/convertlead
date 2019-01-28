<?php

namespace App\Models;

use App\Repositories\AgentRepository;

class Agent extends User
{
    use AgentRepository;

    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'company_agents', 'agent_id');
    }
}
