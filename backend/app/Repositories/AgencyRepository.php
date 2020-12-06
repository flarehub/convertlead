<?php
namespace App\Repositories;

use App\Models\Company;

trait AgencyRepository {

    public function getCompanyBy($id, $withTrashed = false) {
        if ($withTrashed) {
            return $this->companies()->where('company_id', $id)->withTrashed()->firstOrFail();
        }
        return $this->companies()->where('company_id', $id)->firstOrFail();
    }

    public function getAgent($id) {
        return $this->agents()->withTrashed()->where('id', $id)->firstOrFail();
    }

    public function createAgency($data) {
        $data['role'] = Company::$ROLE_AGENCY;
        return $this->createUser($data);
    }
}
