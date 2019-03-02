<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\LeadNote;
use App\Models\LeadStatus;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mockery\Exception;

class LeadNotesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $company, $lead)
    {
        return $request->user()->getCompanyBy($company)->getLeadBy($lead)->leadNotes()->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $company, $lead)
    {
        $this->validate($request, [
            'message' => 'required|string|max:240',
            'status' => 'required|string',
        ]);
    
        $leadStatus = LeadStatus::where('type', $request->get('status'))->firstOrFail();
        $lead = $request->user()->getCompanyBy($company)->getLeadBy($lead);
    
        $request->merge([
            'agent_id' => $request->user()->id,
            'lead_status_id' => $leadStatus->id,
            'lead_id' => $lead->id,
        ]);
    
        $leadNote = new LeadNote();
        $leadNote->fill($request->only([
            'agent_id',
            'lead_status_id',
            'lead_id',
            'message',
        ]));
    
        $leadNote->save();
        
        return $leadNote;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $company, $lead, $id)
    {
        $this->validate($request, [
            'message' => 'required|string|max:240',
        ]);

        $leadNote = $request->user()->getCompanyBy($company)->getLeadBy($lead)->getLeadNoteBy($id);

        $leadNote->fill($request->only([
            'message',
        ]));
    
        $leadNote->save();
    
        return $leadNote;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $company, $lead, $id)
    {
        $leadNote = $request->user()->getCompanyBy($company)->getLeadBy($lead)->getLeadNoteBy($id);
        $leadNote->delete();
        return $leadNote;
    }
}
