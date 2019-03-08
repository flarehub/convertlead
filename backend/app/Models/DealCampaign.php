<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Faker\Generator as Faker;
use Mockery\Exception;

class DealCampaign extends Model
{
    use SoftDeletes;
    public static $INTEGRATION_OPTIN_FORM = 'OPTIN_FORM';
    public static $INTEGRATION_FACEBOOK = 'FACEBOOK';
    public static $INTEGRATION_ZAPIER = 'ZAPIER';
 
    protected $table = 'deal_campaigns';
    
    protected $fillable = [
        'name',
        'uuid',
        'description',
        'deal_id',
        'agency_company_id',
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
    
    public static function createCampaign(Request $request) {
        try {
            \DB::beginTransaction();
            \Validator::validate($request->all(), [
                'name' => 'required|string',
                'deal_id' => 'required|int',
                'uuid' => 'required|string',
                'agency_company_id' => 'required|int',
                'integration' => 'required|string',
                'agents' => 'required'
            ]);
    
            $campaign = (new DealCampaign())->fill($request->only([
                'name',
                'uuid',
                'deal_id',
                'agency_company_id',
                'integration_config',
                'integration',
                'description'
            ]));
            $campaign->save();
            $campaign->agents()->attach($request->get('agents'));
            \DB::commit();
            return $campaign;
        } catch (\Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }
    }

    public function updateCampaign(Request $request, Faker $faker = null) {
        try {

            \DB::beginTransaction();
            $request->merge([
                'uuid' => ($this->uuid ? $this->uuid : $faker->uuid)
            ]);
        
            $this->fill($request->only([
                'name',
                'uuid',
                'integration_config',
                'integration',
                'description'
            ]));

            $this->save();
            if ($request->get('agents')) {
                $this->agents()->detach($this->agents()->get());
                $this->agents()->attach($request->get('agents'));
            }

            \DB::commit();
        } catch (Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }
    }
}
