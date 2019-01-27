<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Permission extends Model {
    public static $PERMISSION_NONE = 'NONE';
    public static $PERMISSION_ALL = 'ALL';
    public static $PERMISSION_COMPANY_READ = 'COMPANY_READ';
    public static $PERMISSION_COMPANY_WRITE = 'COMPANY_WRITE';
    public static $PERMISSION_AGENCY_READ = 'AGENCY_READ';
    public static $PERMISSION_AGENCY_WRITE = 'AGENCY_WRITE';
    public static $PERMISSION_AGENT_READ = 'AGENT_READ';
    public static $PERMISSION_AGENT_WRITE = 'AGENT_WRITE';
    public static $PERMISSION_DEAL_READ = 'DEAL_READ';
    public static $PERMISSION_DEAL_WRITE = 'DEAL_WRITE';
    public static $PERMISSION_LEAD_READ = 'LEAD_READ';
    public static $PERMISSION_LEAD_WRITE = 'LEAD_WRITE';
    public static $PERMISSION_CAMPAIGN_READ = 'CAMPAIGN_READ';
    public static $PERMISSION_CAMPAIGN_WRITE = 'CAMPAIGN_WRITE';
    
    protected $fillable = ['name', 'description'];
    
    public static function getAll() {
        return [
           self::$PERMISSION_ALL,
           self::$PERMISSION_COMPANY_READ,
           self::$PERMISSION_COMPANY_WRITE,
           self::$PERMISSION_AGENCY_READ,
           self::$PERMISSION_AGENCY_WRITE,
           self::$PERMISSION_AGENT_READ,
           self::$PERMISSION_AGENT_WRITE,
           self::$PERMISSION_DEAL_READ,
           self::$PERMISSION_DEAL_WRITE,
           self::$PERMISSION_LEAD_READ,
           self::$PERMISSION_LEAD_WRITE,
           self::$PERMISSION_CAMPAIGN_READ,
           self::$PERMISSION_CAMPAIGN_WRITE,
        ];
    }
    
    public function users() {
        return $this->belongsToMany('App\Models\User', 'user_permissions', 'permission_id');
    }
}
