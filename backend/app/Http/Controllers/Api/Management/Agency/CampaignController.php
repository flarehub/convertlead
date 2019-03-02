<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\DealCampaign;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Faker\Generator as Faker;
use Mockery\Exception;

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
    public function store(Request $request, Faker $faker, $company, $deal, DealCampaign $campaign)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'integration' => 'required|string',
            'agents' => 'required'
        ]);

        $request->merge([
            'uuid' => $faker->uuid,
            'deal_id' => $deal,
            'agency_company_id' => $request->user()->getCompanyBy($company)->pivot->id,
        ]);
        
        $campaign->fill($request->only([
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
        try {
            \DB::beginTransaction();
            $campaign = $request->user()->getCompanyBy($company)->getDealBy($deal)->getCampaignBy($id);
    
            if ($request->json('integration_config')) {
                $request->merge([
                    'integration_config' => json_encode($request->json('integration_config'))
                ]);
            }
            $campaign->fill($request->only([
                'name',
                'uuid',
                'integration_config',
                'integration',
                'description'
            ]));
            
            $campaign->save();
            if ($request->get('agents')) {
                $campaign->agents()->detach($campaign->agents()->get());
                $campaign->agents()->attach($request->get('agents'));
            }
            \DB::commit();
        } catch (Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }

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
