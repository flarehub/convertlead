<?php
namespace App\Repositories;

use App\Models\Company;

trait CompanyRepository {
    public function createCompany($data) {
        $data['role'] = Company::$ROLE_COMPANY;
        return $this->createUser($data);
    }

    public function getCompanyAgentBy($agentId) {
        return $this->agents()->where('agent_id', $agentId)->first();
    }
}