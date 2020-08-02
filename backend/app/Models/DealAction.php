<?php
namespace App\Models;

use App\Jobs\ActionChangeLeadStatus;
use App\Jobs\ActionConnectAgentLeadViaBlindCall;
use App\Jobs\ActionPushAgentDeviceNotification;
use App\Jobs\ActionSendToLeadEmailNotification;
use App\Jobs\ActionSendToLeadSMSNotification;
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

    public function campaign() {
        return $this->hasOne('App\Models\Deal', 'id', 'deal_id');
    }

    public function getPreviousAction() {
        return $this->newQuery()->where('id', $this->parent_id)->first();
    }

    public function getNextAction() {
        $rootLeadActionHistory = false;
        $horizontalNextAction = $this->newQuery()
            ->where('parent_id', $this->id)
            ->where('is_root', 0)
            ->first();

        $rootNextAction = $this->newQuery()
            ->where('parent_id', $this->id)
            ->where('is_root', 1)
            ->first();

        if ($rootNextAction) {
            $rootLeadActionHistory = LeadActionHistory::firstWhere('deal_action_id', $rootNextAction->id);
        }

        return ($rootLeadActionHistory ?: $horizontalNextAction);
    }


    public function scheduleLeadAction(Lead $lead) {
        $leadActionHistory = new LeadActionHistory();
        $dealTimezone = $this->deal->timezone;

        $leadActionHistory->fill([
            'lead_id' => $lead->id,
            'deal_action_id' => $this->id,
            'is_completed' => 0,
        ]);
        $leadActionHistory->save();

        switch ($this->type) {
            case DealAction::TYPE_EMAIL_MESSAGE: {

                ActionSendToLeadEmailNotification::dispatch($leadActionHistory)->delay(
                    now($dealTimezone)->addMinutes($this->delay_time)
                )->onQueue('action-email-notification');
            }
            case DealAction::TYPE_SMS_MESSAGE: {
                ActionSendToLeadSMSNotification::dispatch($leadActionHistory)->delay(
                    now($dealTimezone)->addMinutes($this->delay_time)
                )->onQueue('action-sms-notification');
            }
            case DealAction::TYPE_CHANGE_STATUS: {
                ActionChangeLeadStatus::dispatch($leadActionHistory)->delay(
                    now($dealTimezone)->addMinutes($this->delay_time)
                )->onQueue('action-change-lead-status');
            }
            case DealAction::TYPE_BLIND_CALL: {
                ActionConnectAgentLeadViaBlindCall::dispatch($leadActionHistory)->delay(
                    now($dealTimezone)->addMinutes($this->delay_time)
                )->onQueue('action-blind-call');
            }
            case DealAction::TYPE_PUSH_NOTIFICATION: {
                ActionPushAgentDeviceNotification::dispatch($leadActionHistory)->delay(
                    now($dealTimezone)->addMinutes($this->delay_time)
                )->onQueue('action-push-notification');
            }
            default:
        }
    }
}
