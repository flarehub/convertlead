<?php

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;
use Laravel\Passport\Passport;

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
        'name', 'phone', 'avatar_id', 'agent_agency_id', 'email', 'password', 'role',
    ];

    protected $appends = ['avatar_path', 'permissions'];
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token', 'avatar',
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
                Permission::$PERMISSION_CAMPAIGN_READ,
            ];
        } elseif ($role === self::$ROLE_COMPANY) {
            return [
                Permission::$PERMISSION_DEAL_READ,
                Permission::$PERMISSION_AGENT_READ,
                Permission::$PERMISSION_LEAD_READ,
                Permission::$PERMISSION_LEAD_WRITE,
                Permission::$PERMISSION_CAMPAIGN_READ,
                Permission::$PERMISSION_CAMPAIGN_WRITE,
                Permission::$PERMISSION_LEAD_NOTE_READ,
                Permission::$PERMISSION_LEAD_NOTE_WRITE,
            ];
        } elseif ($role === self::$ROLE_AGENT) {
            return [
                Permission::$PERMISSION_DEAL_READ,
                Permission::$PERMISSION_LEAD_READ,
                Permission::$PERMISSION_LEAD_WRITE,
                Permission::$PERMISSION_LEAD_NOTE_READ,
                Permission::$PERMISSION_LEAD_NOTE_WRITE,
                Permission::$PERMISSION_CAMPAIGN_READ,
            ];
        }
        return [
            Permission::$PERMISSION_NONE,
        ];
    }
    
    public function permissions() {
        return $this->belongsToMany('App\Models\Permission', 'user_permissions', 'user_id');
    }
    
    public function avatar() {
        return $this->hasOne('App\Models\Media', 'id', 'avatar_id');
    }
    
    public function createUser($data) {
        \Validator::validate($data, self::requiredFieldsForCreate());
        $data['password'] = bcrypt($data['password']);
        $this->fill($data);
        
        return $this->save();
    }
    
    /**
     * Uploads the users avatar.
     *
     * @param \Illuminate\Http\Request $request
     *
     * return void
     */
    public function handleAvatar(Request $request)
    {
        $media = new Media;
        if ($media->upload($request, 'avatar', Media::AVATAR_PATH)) {
            $request->merge(['avatar_id' => $media->id]);
        }
    }

    public function updateUser($data) {
        if (isset($data['password'])) {
            \Validator::validate($data, [
                'password' => 'required|confirmed|min:6'
            ]);
            $data['password'] = bcrypt($data['password']);
        }
    
        if (isset($data['email'])) {
            \Validator::validate($data, [
                'email' => "required|email|userEmail:{$this->id}"
            ]);
        }
        $this->fill($data);
        $this->save();
        return $this;
    }
    
    static function requiredFieldsForCreate() {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|userEmail',
            'phone' => 'required|max:100',
            'password' => 'required|confirmed|min:6',
        ];
    }
    
    public function getPermissionsAttribute() {
        return $this->permissions()->get();
    }
    
    /**
     * Returns user avatar or placeholder path.
     *
     * @return string
     */
    public function getAvatarPathAttribute()
    {
        return $this->avatar ? $this->avatar->path : asset('images/user.png');
    }
    
    public function getPermissions() {
        $userScopes = collect($this->permissions)->map(function ($permission) {
            return $permission->name;
        });
    
        return $userScopes->merge(User::getDefaultPermissionsByRole($this->role))->unique();
    }
    
    public function setupUserRolePermissions() {
        Passport::actingAs($this, $this->getPermissions());
    }
}
