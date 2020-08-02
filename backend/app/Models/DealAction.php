<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DealAction extends Model {
    use SoftDeletes;

    public const TYPE_NONE = 'NONE';
    public const TYPE_SMS_MESSAGE = 'SMS';
    public const TYPE_EMAIL_MESSAGE = 'EMAIL';
    public const TYPE_PUSH_NOTIFICATION  = 'PUSH_NOTIFICATION';
    public const TYPE_BLIND_CALL = 'BLIND_CALL';
    public const TYPE_CHANGE_STATUS = 'CHANGE_STATUS';

    public const LEAD_REPLY_TYPE_NONE = 'NONE';
    public const LEAD_REPLY_TYPE_SMS_REPLY = 'SMS_REPLY';
    public const LEAD_REPLY_TYPE_SMS_REPLY_CONTAIN = 'SMS_REPLY_CONTAIN';
    public const LEAD_REPLY_TYPE_MAIL_OPEN = 'MAIL_OPEN';

    protected $fillable = [
        'paren_id',
        'deal_id',
        'type',
        'lead_reply_type',
        'is_root',
        'object',
        'delay_time',
        'delay_type',
    ];

    public function getObjectAttribute($object)
    {
        return $object ? json_decode($object) : json_decode('{}');
    }
}
