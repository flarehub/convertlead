<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Campaign extends Model
{
    use SoftDeletes;
    
    protected $table = 'deal_campaigns';

    protected $fillable = [
        'name',
        'description',
    ];
    
    public function deal() {
        return $this->belongsTo('App\Models\Deal');
    }
}
