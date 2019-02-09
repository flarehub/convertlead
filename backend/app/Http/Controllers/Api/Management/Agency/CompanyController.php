<?php

namespace App\Http\Controllers\Api\Management\Agency;

use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Mockery\Exception;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $itemsPerPage = (int)$request->get('per_page', 100);
        $page = (int)$request->get('current_page', 1);
        
        return $request->user()->getCompanies($request->all([
            'search',
            'name',
            'deals',
            'leads',
            'agents',
            'showDeleted',
            'avg_response',
        ]))->paginate($itemsPerPage, ['*'], 'page', $page);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Company $company)
    {
        $company->handleAvatar($request);
        $company->createCompany($request->only(['name', 'is_locked', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
        $request->user()->companies()->attach($company);
        return $company;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        return $request->user()->companies()->where('company_id', $id)->first();
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $company = $request->user()->getCompanyBy($id);
        $company->handleAvatar($request);
        $company->updateUser($request->except('role'));
        return $company;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $company = $request->user()->getCompanyBy($id);
        $company->delete();
        return $company;
    }
}
