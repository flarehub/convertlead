<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

/**
 * App\Models\User
 *
 * @mixin \Eloquent
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Passport\Client[] $clients
 * @property-read \Illuminate\Database\Eloquent\Collection|\Laravel\Passport\Token[] $tokens
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\User whereUpdatedAt($value)
 */
class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    protected $table = 'users';
    
    public static $ROLE_ADMIN = 'ADMIN';
    public static $ROLE_AGENCY = 'AGENCY';
    public static $ROLE_COMPANY = 'COMPANY';
    public static $ROLE_AGENT = 'AGENT';
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'role'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];
    
    public function getDefaultPermissions() {
        return self::getDefaultPermissionsByRole($this->role);
    }
    
    public static function getDefaultPermissionsByRole($role) {
        if ($role === self::$ROLE_ADMIN) {
            return [
                Permission::$PERMISSION_ALL,
            ];
        }
        elseif ($role === self::$ROLE_AGENCY) {
            return [
                Permission::$PERMISSION_COMPANY_READ,
                Permission::$PERMISSION_COMPANY_WRITE,
                Permission::$PERMISSION_DEAL_READ,
                Permission::$PERMISSION_DEAL_WRITE,
                Permission::$PERMISSION_AGENT_READ,
                Permission::$PERMISSION_AGENT_WRITE,
                Permission::$PERMISSION_LEAD_READ,
            ];
        } elseif ($role === self::$ROLE_COMPANY) {
            return [
                Permission::$PERMISSION_DEAL_READ,
                Permission::$PERMISSION_AGENT_READ,
                Permission::$PERMISSION_LEAD_READ,
                Permission::$PERMISSION_LEAD_WRITE,
            ];
        } elseif ($role === self::$ROLE_AGENT) {
            return [
                Permission::$PERMISSION_DEAL_READ,
                Permission::$PERMISSION_LEAD_READ,
                Permission::$PERMISSION_LEAD_WRITE,
            ];
        }
        return [
            Permission::$PERMISSION_NONE,
        ];
    }
    
    public function permissions() {
        return $this->belongsToMany('App\Models\Permission', 'user_permissions', 'user_id');
    }
}
