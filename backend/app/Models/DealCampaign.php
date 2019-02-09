<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealCampaign extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
    ];
    
    public function agents() {
        return $this->belongsToMany(
            'App\Models\Agent', 'deal_campaign_agents',
            'deal_campaign_id',
            'agent_id');
    }

    public function leads() {
        return $this->belongsTo('App\Models\Lead', 'leads');
    }
}
