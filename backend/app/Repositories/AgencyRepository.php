<?php
namespace App\Repositories;

use App\Models\Agency;
use App\Models\Company;

trait AgencyRepository {

    public function getCompanyBy($id) {
        return $this->companies()->where('company_id', $id)->firstOrFail();
    }

    public function getAgent($id) {
        return $this->agents()->where('agent_id', $id)->firstOrFail();
    }

    public function createCompany($data) {
        $data['role'] = Company::$ROLE_AGENCY;
        return $this->createUser($data);
    }
}