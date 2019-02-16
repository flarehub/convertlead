<?php
namespace App\Repositories;

use App\Models\Company;

trait CompanyRepository {
    public function createCompany($data) {
        $data['role'] = Company::$ROLE_COMPANY;
        return $this->createUser($data);
    }

    public function getAgentBy($agentId) {
        return $this->agents()->where('agent_id', $agentId)->firstOrFail();
    }
    
    public function getDealBy($dealId) {
        return $this->deals()->where('deals.id', $dealId)->firstOrFail();
    }

    public function getLeadBy($leadId) {
        return $this->leads()->where('leads.id', $leadId)->firstOrFail();
    }
}