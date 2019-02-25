<?php

namespace App\Repositories;

trait DealRepository {
    public function getCampaignBy($id) {
        return $this->campaigns()->where('id', $id)->firstOrFail();
    }
}