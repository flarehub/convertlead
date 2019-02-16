<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Faker\Generator as Faker;

class DealCampaign extends Model
{
    use SoftDeletes;
    public static $INTEGRATION_MANUAL_ADDED = 'MANUAL_ADDED';
    public static $INTEGRATION_OPTIN_FORM = 'OPTIN_FORM';
    public static $INTEGRATION_FACEBOOK = 'FACEBOOK';
    public static $INTEGRATION_ZAPIER = 'ZAPIER';
    
    protected $fillable = [
        'name',
        'uuid',
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
    
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($query, Faker $faker) {
            $query->uuid = ($query->uuid
                ? $query->uuid
                : $faker->uuid);
        });
    }
}
