<?php

namespace App\Http\Controllers\Api;

use App\Models\Agency;
use App\Models\Company;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AgencyController extends Controller
{

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Agency $agency)
    {
        $this->validate($request,  [
            'subscription_type' => 'required:string'
        ]);

        $password = Str::random(10);

        $request->merge([
            'password' => $password,
            'password_confirmation' => $password,
            'max_agency_companies' => Agency::getMaxCompaniesCanCreateBy($request->get('subscription_type')),
        ]);

        $agency->handleAvatar($request);
        $agency->createAgency($request->only([
            'name',
            'avatar_id',
            'phone',
            'email',
            'subscription_type',
            'max_agency_companies',
            'password',
            'password_confirmation'
        ]));
        return $agency;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function storeCompany(Request $request, $agencyUUID, Company $company)
    {
        $agency = Agency::where('uuid', $agencyUUID)->first();
        if (!$agency) {
            $error = ValidationException::withMessages([
                'agency' => ['Agency not found!'],
            ]);
            throw $error;
        }
        $countCompanies = $agency->companies()->count();
        if ($countCompanies >= $agency->max_agency_companies) {
            $error = ValidationException::withMessages([
                'max_agency_companies' => ['You have exceeded the maxim number of allowed companies to create!'],
            ]);
            throw $error;
        }
        $password = Str::random(10);
        $request->merge([
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $company->handleAvatar($request);
        $company->createCompany($request->only(['name', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
        $agency->companies()->attach($company);
        return $company;
    }
}
