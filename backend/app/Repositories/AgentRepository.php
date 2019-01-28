<?php
namespace App\Repositories;

use App\Models\Agency;
use App\Models\Company;

trait AgentRepository {
    public function createAgent($data) {
        $data['role'] = Company::$ROLE_AGENT;
        return $this->createUser($data);
    }
}