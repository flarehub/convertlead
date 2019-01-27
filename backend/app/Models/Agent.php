<?php

namespace App\Models;

class Agent extends User
{
    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'company_agents', 'agent_id');
    }
}
