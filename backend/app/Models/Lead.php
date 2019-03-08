<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Lead extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'agency_company_id',
        'deal_campaign_id',
        'agent_id',
        'lead_status_id',
        'fullname',
        'email',
        'phone',
        'metadata',
    ];
    
    protected $appends = [
        'campaign',
        'status',
        'company',
        'agent',
    ];
    
    public function campaign() {
        return $this->hasOne('App\Models\DealCampaign', 'id', 'deal_campaign_id');
    }
    
    public function company() {
        return Company::join('agency_companies AS ac', 'ac.company_id', 'users.id');
    }
    
    public function agent() {
        return $this->hasOne('App\Models\Agent', 'id', 'agent_id');
    }

    public function status() {
        return $this->hasOne('App\Models\LeadStatus', 'id', 'lead_status_id');
    }

    public function leadNotes() {
        return $this->hasMany('App\Models\LeadNote', 'lead_id', 'id');
    }

    public function getCampaignAttribute() {
        $company = $this->campaign()->withTrashed()->first();
        if ($company) {
            return $company->only(['id', 'name', 'uuid', 'description', 'deal']);
        }
        return null;
    }

    public function getCompanyAttribute() {
        $company = $this->company()->selectRaw('users.*')->where('ac.id', $this->agency_company_id)->withTrashed()->first();
        if ($company) {
            return $company->only(['id', 'name', 'email', 'avatar_path']);
        }
        return null;
    }

    public function getAgentAttribute() {
        $agent = $this->agent()->selectRaw('users.*')->withTrashed()->first();
        if ($agent) {
            return $agent->only(['id', 'name', 'avatar_path']);
        }
        return null;
    }

    public function getStatusAttribute() {
        $status = $this->status()->withTrashed()->first();
        if ($status) {
            return $status->type;
        }
        return LeadStatus::$STATUS_NEW;
    }

    public function getLeadNoteBy($id) {
        return $this->leadNotes()->where('id', $id)->firstOrFail();
    }

    public function updateLead(Request $request) {
        try {
            \DB::beginTransaction();
    
            $oldStatus = $this->status;
            $status = $request->get('status');
            $leadStatus = LeadStatus::where('type', $status)->firstOrFail();
            $request->merge(['lead_status_id' => $leadStatus->id]);
            $hasNewStatus = $this->lead_status_id !== $leadStatus->id;
            $agencyCompanyId = DealCampaign::findOrFail($request->get('deal_campaign_id'))->agency_company_id;

            $request->merge([
                'agency_company_id' => $agencyCompanyId
            ]);

            \Validator::validate($request->all(), [
                'fullname' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'agent_id' => 'required|int',
                'deal_campaign_id' => 'required|int',
                'agency_company_id' => 'required|int',
                'status' => 'required|string',
            ]);
            
            $this->fill($request->only([
                'fullname',
                'email',
                'phone',
                'agent_id',
                'metadata',
                'deal_campaign_id',
                'lead_status_id',
                'agency_company_id',
            ]));
    
            if ($hasNewStatus) {
                LeadNote::create([
                    'lead_status_id' => $leadStatus->id,
                    'lead_id' => $this->id,
                    'agent_id' => $request->user()->id,
                    'message' => "Status changed from {$oldStatus} to {$status}! ",
                ]);
            }
            $this->save();

            \DB::commit();
            return $this;
        } catch (\Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }
    }

    public static function createLead(Request $request) {
        try {
            \DB::beginTransaction();
            $agencyCompanyId = DealCampaign::findOrFail($request->get('deal_campaign_id'))->agency_company_id;

            $request->merge([
                'agency_company_id' => $agencyCompanyId
            ]);

            \Validator::validate($request->all(), [
                'fullname' => 'required|string|max:255',
                'email' => 'required|string|max:255',
                'phone' => 'required|string|max:255',
                'agent_id' => 'required|int',
                'deal_campaign_id' => 'required|int',
                'agency_company_id' => 'required|int',
                'status' => 'required|string',
            ]);

            $status = $request->get('status');
            $leadStatus = LeadStatus::where('type', $status)->firstOrFail();
            $request->merge(['lead_status_id' => $leadStatus->id]);
    
            $lead = self::create($request->only([
                'lead_status_id',
                'fullname',
                'email',
                'phone',
                'agent_id',
                'metadata',
                'deal_campaign_id',
                'agency_company_id',
            ]));
    
            LeadNote::create([
                'lead_status_id' => $leadStatus->id,
                'lead_id' => $lead->id,
                'agent_id' => $request->user()->id,
                'message' => 'Lead Created manually',
            ]);

            \DB::commit();
            return $lead;
        } catch (\Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }
    }
}
