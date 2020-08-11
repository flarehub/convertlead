<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadActionHistory extends Model {
    use SoftDeletes;

    protected $fillable = [
        'lead_id',
        'deal_action_id',
        'is_completed',
    ];

    public function moveToCompleted() {
        $this->is_completed = 1;
        $this->save();
    }
}
