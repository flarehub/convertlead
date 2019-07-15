<?php

namespace App\Http\Controllers\Api;

use App\Models\Agency;
use App\Models\Company;
use App\Services\MailService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AgencyController extends Controller
{

    /**
     * @param Request $request
     * @param Agency $agency
     * @return Agency|\Illuminate\Database\Eloquent\Model
     * @throws \Exception
     */
    public function store(Request $request, Agency $agency)
    {
        $event = $request->get('event');
        $email = $request->get('buyer_email', $request->get('email'));

        if (($event === 'subscription-created') || ($event === 'subscription-trial-start')) {
            return $this->createAgency($request, $agency);
        } elseif (($event === 'subscription-payment-failed') || ($event === 'subscription-cancelled')) {
            $agency = Agency::where('email', $email)->firstOrFail();
            $agency->delete();
            return $agency;
        } elseif ($event === 'subscription-changed') {
            $agency = Agency::where('email', $email)->firstOrFail();
            $subscriptionType = strtoupper($request->get('type', $request->get('subscription_type')));
            $maxNumberOfCompanies = Agency::getMaxCompaniesCanCreateBy($subscriptionType);
            $agency->fill([
               'max_agency_companies' => $maxNumberOfCompanies,
               'subscription_type' => $subscriptionType
            ]);
            $agency->save();
            return $agency;
        } elseif ($event === 'subscription-updated' || $event === 'subscription-payment') {
            $agency = Agency::withTrashed()->where('email', $email)->firstOrFail();
            $agency->restore();
            return $agency;
        }
    }

    /**
     * @param Request $request
     * @param $agencyUUID
     * @param Company $company
     * @return Company|\Illuminate\Database\Eloquent\Model
     * @throws \Exception
     */
    public function storeCompany(Request $request, $agencyUUID, Company $company)
    {
        $event = $request->get('event');
        $email = $request->get('buyer_email', $request->get('email'));

        if (($event === 'subscription-created') || ($event === 'subscription-trial-start')) {
            return $this->createCompany($request, $agencyUUID, $company);
        } elseif (($event === 'subscription-payment-failed') || ($event === 'subscription-cancelled')) {
            $company = Company::where('email', $email)->firstOrFail();
            $company->delete();
            return $company;
        } elseif ($event === 'subscription-updated' || $event === 'subscription-payment') {
            $company = Company::withTrashed()->where('email', $email)->firstOrFail();
            $company->restore();
            return $company;
        }
    }

    /**
     * @param Request $request
     * @param Agency $agency
     * @return Agency
     */
    private function createAgency(Request $request, Agency $agency): Agency
    {
        $this->validate($request, [
            'type' => 'required:string'
        ]);

        $type = strtoupper($request->get('type', $request->get('subscription_type')));
        $maxNumberOfCompanies = Agency::getMaxCompaniesCanCreateBy($type);
        $password = Str::random(10);
        $name = $request->get('buyer_first_name') . ' ' . $request->get('buyer_last_name');
        $name = ($name ? $name : $request->get('name'));
        $email = $request->get('buyer_email', $request->get('email'));
        $request->merge([
            'email' => $email,
            'name' => $name,
            'subscription_type' => $type,
            'password' => $password,
            'password_confirmation' => $password,
            'max_agency_companies' => $maxNumberOfCompanies,
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

        MailService::sendMail('emails.agency-welcome', [
            'agency' => $agency,
            'password' => $password,
        ],
            $agency->email,
            env('APP_AGENCY_WELCOME_EMAIL_SUBJECT', 'Agency Welcome email')
        );

        return $agency;
    }

    /**
     * @param Request $request
     * @param $agencyUUID
     * @param Company $company
     * @return Company
     */
    private function createCompany(Request $request, $agencyUUID, Company $company): Company
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

        $name = $request->get('buyer_first_name') . ' ' . $request->get('buyer_last_name');
        $name = ($name ? $name : $request->get('name'));
        $email = $request->get('buyer_email', $request->get('email'));

        $password = Str::random(10);
        $request->merge([
            'email' => $email,
            'name' => $name,
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $company->handleAvatar($request);
        $company->createCompany($request->only(['name', 'avatar_id', 'phone', 'email', 'password', 'password_confirmation']));
        $agency->companies()->attach($company);

        MailService::sendMail('emails.company-welcome', [
            'agency' => $agency,
            'company' => $company,
            'password' => $password,
        ],
            $company->email,
            env('APP_COMPANY_WELCOME_EMAIL_SUBJECT', 'Company Welcome email')
        );

        return $company;
    }
}
