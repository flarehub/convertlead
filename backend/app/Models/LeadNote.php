<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadNote extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'lead_status_id',
        'lead_id',
        'agent_id',
        'message',
    ];

    protected $appends = ['agent', 'status'];
    
    public function agent() {
        return $this->hasOne('App\Models\Agent', 'id', 'agent_id');
    }

    public function status() {
        return $this->hasOne('App\Models\LeadStatus', 'id', 'lead_status_id');
    }
    
    public function lead() {
        return $this->hasOne('App\Models\Lead', 'id', 'lead_id');
    }
    
    public function getAgentAttribute() {
        return $this->agent()->first();
    }
 
    public function getStatusAttribute() {
        return $this->status()->first();
    }
}
