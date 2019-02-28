<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealCampaign extends Model
{
    use SoftDeletes;
    public static $INTEGRATION_MANUAL_ADDED = 'MANUAL_ADDED';
    public static $INTEGRATION_OPTIN_FORM = 'OPTIN_FORM';
    public static $INTEGRATION_FACEBOOK = 'FACEBOOK';
    public static $INTEGRATION_ZAPIER = 'ZAPIER';
 
    protected $table = 'deal_campaigns';
    
    protected $fillable = [
        'name',
        'uuid',
        'description',
        'integration',
        'integration_config',
    ];
    
    protected $appends = ['agents'];
    
    public function deal() {
        return $this->belongsTo('App\Models\Deal');
    }
    
    public function agents() {
        return $this->belongsToMany('App\Models\Agent', 'deal_campaign_agents');
    }
    
    public function leads() {
        return $this->belongsTo('App\Models\Lead', 'id', 'deal_campaign_id');
    }
    
    public function getAgentsAttribute() {
        $agents = $this->agents()
            ->orderBy('agent_leads_count', 'ASC')
            ->withPivot('agent_leads_count')->get();
        if ($agents) {
            return collect($agents)->map(function ($agent) {
                return $agent->only('name', 'avatar_path', 'id', 'pivot');
            });
        }
        return $agents;
    }
    
    public function getLeadsCountAttribute() {
        return $this->leads()->count();
    }
}
