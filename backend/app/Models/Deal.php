<?php

namespace App\Models;

use App\Repositories\DealRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deal extends Model
{
    use SoftDeletes, DealRepository;

    protected $fillable = [
        'name',
        'description',
        'agency_company_id',
    ];
    
    public function agencies() {
        return $this->belongsToMany('App\Models\Agency', 'agency_companies', 'id', 'agency_id', 'agency_company_id', 'id');
    }

    public function companies() {
        return $this->belongsToMany('App\Models\Company', 'agency_companies', 'id', 'company_id', 'agency_company_id', 'id');
    }
    
    public function campaigns() {
        return $this->hasMany('App\Models\Campaign');
    }
}
