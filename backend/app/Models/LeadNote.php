<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadNote extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'message',
    ];
}
