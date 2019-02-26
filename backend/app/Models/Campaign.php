<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use SoftDeletes;
    
    protected $table = 'deal_campaigns';

    protected $fillable = [
        'name',
        'description',
        'integration',
    ];
    
    protected $appends = ['agents'];
    
    public function deal() {
        return $this->belongsTo('App\Models\Deal');
    }

    public function agents() {
        return $this->belongsToMany('App\Models\Agent', 'deal_campaign_agents', 'id', 'agent_id');
    }

    public function leads() {
        return $this->belongsTo('App\Models\Lead', 'id', 'deal_campaign_id');
    }
    
    public function getAgentsAttribute() {
        $agents = $this->agents()->get();
        if ($agents) {
            return collect($agents)->map(function ($agent) {
                return $agent->only('name', 'avatar_path', 'id');
            });
        }
        return $agents;
    }
    
    public function getLeadsCountAttribute() {
        return $this->leads()->count();
    }
}
