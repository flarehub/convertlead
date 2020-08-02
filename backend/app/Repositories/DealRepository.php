<?php

namespace App\Repositories;

use App\Models\Deal;

trait DealRepository {
    public function getCampaignBy($id) {
        return $this->campaigns()->where('id', $id)->firstOrFail();
    }

    public function getActionsBy($dealId) {
        return $this->actions()->where('deal_id', $dealId);
    }

    public function getActionBy(int $id) {
        return $this->actions()->where('id', $id)->firstOrFail();
    }
}
