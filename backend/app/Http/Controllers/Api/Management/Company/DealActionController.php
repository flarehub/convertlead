<?php

namespace App\Http\Controllers\Api\Management\Company;

use App\Models\DealAction;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class DealActionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $deal)
    {
        return $request->user()->getDealBy($deal)->actions->map(function (DealAction $dealAction) {
            $dealAction->object = json_decode($dealAction->object);
            return $dealAction;
        });
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $deal, DealAction $dealAction)
    {
        $request->merge([
            'deal_id' => $deal,
            'object' => json_encode($request->json('object')),
        ]);
        $dealAction->fill($request->only([
            'paren_id',
            'deal_id',
            'type',
            'lead_reply_type',
            'is_root',
            'object',
            'delay_time',
            'delay_type',
        ]));

        $dealAction->save();
        $dealAction->object = json_decode($dealAction->object);
        return $dealAction;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $deal, $id)
    {
        return $request->user()->getDealBy($deal)->getActionBy($id);
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
        $dealAction = $request->user()->getDealBy($deal)->getActionBy($id);
        $dealAction->fill($request->only([
            'paren_id',
            'type',
            'lead_reply_type',
            'is_root',
            'object',
            'delay_time',
            'delay_type',
        ]));
        $dealAction->save();
        return $dealAction;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $deal, $id)
    {
        $dealAction = $request->user()->getDealBy($deal)->getActionBy($id);

        return $dealAction->delete();
    }
}
