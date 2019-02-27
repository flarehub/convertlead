<?php

namespace App\Http\Controllers\Api\Management\Company;

use App\Models\Deal;
use App\Models\DealCampaign;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CampaignController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $deal)
    {
        return $request->user()->getDealBy($deal)->campaigns()->paginate(100);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $deal, DealCampaign $campaign)
    {
        $campaign->fill($request->only(['name', 'description']));
        $campaign->deal()->associate($request->user()->getDealBy($deal));
        $campaign->save();
        return $campaign;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $deal, $id)
    {
        return $request->user()->getDealBy($deal)->getCampaignBy($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $deal, $id)
    {
        $campaign = $request->user()->getDealBy($deal)->getCampaignBy($id);
        $campaign->fill($request->only(['name', 'description']));
        $campaign->save();
        return $campaign;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $deal, $id)
    {
        $campaign = $request->user()->getDealBy($deal)->getCampaignBy($id);
        $campaign->delete();
        return $campaign;
    }
}
