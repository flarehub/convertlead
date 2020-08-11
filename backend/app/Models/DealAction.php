<?php
namespace App\Models;

use App\Jobs\DealActionJob;
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

    protected $appends = [
        'rootParent'
    ];

    public function getObjectAttribute($object)
    {
        return $object ? json_decode($object) : json_decode('{}');
    }

    public function deal() {
        return $this->hasOne('App\Models\Deal', 'id', 'deal_id');
    }

    public function getPreviousAction() {
        return $this->newQuery()->where('id', $this->parent_id)->first();
    }

    public function getNextHorizontalAction() {
        return $this->newQuery()
            ->where('parent_id', $this->id)
            ->where('is_root', 0)
            ->first();
    }

    public function getNextVerticalAction() {
        return $this->newQuery()
            ->where('parent_id', $this->id)
            ->where('is_root', 1)
            ->first();
    }

    public function scheduleNextLeadAction(Lead $lead) {

        if ($this->rootParent) {
            $nextAction = $this->getNextHorizontalAction();

            $rootNextVerticalAction = $this->rootParent->getNextVerticalAction();

            if ($rootNextVerticalAction) {
                $nextRootVerticalAction = LeadActionHistory::query()
                    ->where('lead_id', $lead->id)
                    ->where('deal_action_id', $rootNextVerticalAction->id)
                    ->first();
                if ($nextRootVerticalAction) {
                    $nextRootVerticalAction->moveToCompleted();
                }
            }
        } elseif (!$this->rootParent && !$this->is_root) {
            $nextAction = $this->getNextHorizontalAction();
        }
        else {
            $nextAction = $this->getNextVerticalAction();
        }

        if ($nextAction) {
            $nextAction->scheduleLeadAction($lead);
        }
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

        DealActionJob::dispatch($leadActionHistory)->delay(
            now($dealTimezone)->addMinutes($this->delay_time)
        )->onQueue('deal-actions');
    }

    public function getRootParentAttribute() {
        if ($this->parent_id && !$this->is_root) {
            return DealAction::query()
                ->where('id', $this->parent_id)
                ->where('is_root', 1)
                ->first();
        }
        return false;
    }
}
