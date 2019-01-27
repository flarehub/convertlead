<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LeadStatus extends Model
{
    use SoftDeletes;

    private static $STATUS_NONE = 'NONE';
    private static $STATUS_VIEWED = 'VIEWED';
    private static $STATUS_CONTACTED_SMS = 'CONTACTED_SMS';
    private static $STATUS_CONTACTED_CALL = 'CONTACTED_CALL';
    private static $STATUS_CONTACTED_EMAIL = 'CONTACTED_EMAIL';
    private static $STATUS_MISSED = 'MISSED';
    private static $STATUS_BAD = 'BAD';
    private static $STATUS_SOLD = 'SOLD';

    protected $fillable = [
        'name',
        'description',
        'type',
    ];
}
