<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Deal;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DealController extends Controller
{
    public function all(Request $request) {
        return $request->user()->deals()->paginate(100);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $company)
    {
        return $request->user()->getCompanyBy($company)->deals()->paginate(100);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $company, Deal $deal)
    {
        $this->validate($request, [
           'name' => 'required|string|max:255'
        ]);

        $agencyCompanyId = $request->user()->getCompanyBy($company)->pivot->id;
        $request->merge(['agency_company_id' => $agencyCompanyId ]);
        $deal->fill($request->only(['name', 'description', 'agency_company_id']));
        $deal->save();

        return $deal;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $company, $id)
    {
        return $request->user()->getCompanyBy($company)->getCompanyDealBy($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $company, $id)
    {
        $this->validate($request, [
            'name' => 'required|string|max:255'
        ]);
        $deal = $request->user()->getCompanyBy($company)->getCompanyDealBy($id);

        $deal->fill($request->only(['name', 'description']));
        $deal->save();
    
        return $deal;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $company, $id)
    {
        $deal = $request->user()->getCompanyBy($company)->getCompanyDealBy($id);
        $deal->delete();
        return $deal;
    }
}
