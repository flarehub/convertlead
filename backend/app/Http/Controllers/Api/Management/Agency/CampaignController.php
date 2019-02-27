<?php

namespace App\Http\Controllers\Api\Management\Agency;

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
    public function index(Request $request, $company, $deal)
    {
        $itemsPerPage = (int)$request->get('per_page', 10);
        $page = (int)$request->get('current_page', 1);

        return $request
            ->user()
            ->getCompanyBy($company)
            ->getDealBy($deal)
            ->getCampaignsBy($request->only([
                'showDeleted',
                'name',
                'type',
                'leads',
                'avg_time_response',
            ]))
            ->paginate($itemsPerPage, ['*'], 'campaigns', $page);
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $company, $deal, DealCampaign $campaign)
    {

        $deal = $request->user()->getCompanyBy($company)->getDealBy($deal);
        $campaign->fill($request->only(['name', 'description']));
        $campaign->save();
        $campaign->deal()->associate($deal);

        return $campaign;
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $company, $deal, $id)
    {
        $deal = $request->user()->getCompanyBy($company)->getDealBy($deal);
        return $deal->getCampaignBy($id);
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $company, $deal, $id)
    {
        $campaign = $request->user()->getCompanyBy($company)->getDealBy($deal)->getCampaignBy($id);
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
    public function destroy(Request $request, $company, $deal, $id)
    {
        $campaign = $request
            ->user()
            ->getCompanyBy($company)
            ->getDealBy($deal)
            ->getCampaignBy($id);

        $campaign->delete();

        return $campaign;
    }
}
