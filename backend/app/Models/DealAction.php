<?php
namespace App\Models;

use App\Jobs\DealActionJob;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Optional;

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
        'parent_id',
        'deal_id',
        'type',
        'lead_reply_type',
        'lead_reply_contains',
        'is_root',
        'object',
        'delay_time',
        'delay_type',
        'stop_on_manual_contact',
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

    /**
     * @return \Illuminate\Database\Eloquent\Builder|Model|object|null|DealAction
     */
    public function getPrevVerticalAction() {
        return $this->newQuery()
            ->where('id', $this->parent_id)
            ->where('is_root', 1)
            ->first();
    }

    public function getNextVerticalAction() {
        return $this->newQuery()
            ->where('parent_id', $this->id)
            ->where('is_root', 1)
            ->first();
    }

    /**
     * Schedule next horizontal action for lead
     *
     * @param Lead $lead
     * @return bool
     */
    public function scheduleNextHorizontalAction(Lead $lead) {
        $nextAction = $this->getNextHorizontalAction();
        if ($nextAction) {
            $nextActionVertical = $this->getNextVerticalAction();

            /** @var LeadActionHistory $leadActionHistory */
            $leadActionHistory = LeadActionHistory::query()
                ->where('lead_id', $lead->id)
                ->where('deal_action_id', $nextActionVertical->id)
                ->first();

            if (\optional($leadActionHistory)->is_completed) {
                \Log::info('Exclude next horizontal action because it is completed on vertical before it', $leadActionHistory->toArray());
                return false;
            }

            if ($leadActionHistory && ! \optional($leadActionHistory)->is_completed) {
                $leadActionHistory->moveToCompleted();
            }

            \Log::info('scheduleNextOrizontalAction===========>' . $nextAction->id);

            $nextAction->scheduleAction($lead);
            return true;

        } else {
            \Log::info('No next action found for action ' . $this->id . ' and lead ' . $lead->id);
        }

        return false;
    }

    /**
     * Schedule next vertical action for lead
     *
     * @param Lead $lead
     * @return bool
     */
    public function scheduleNextVerticalAction(Lead $lead) {
        $nextHorizontal = $this->getNextHorizontalAction();

        if ($nextHorizontal) {
            /** @var LeadActionHistory $leadActionHistory */
            $leadActionHistory = LeadActionHistory::query()
                ->where('lead_id', $lead->id)
                ->where('deal_action_id', $nextHorizontal->id)
                ->first();

            if ($leadActionHistory) {
                return false;
            }
        }

        $prevVertical = $this->getPrevVerticalAction();

        if ($prevVertical) {
            $nextHorizontal = $prevVertical->getNextHorizontalAction();

            if ($nextHorizontal) {
                /** @var LeadActionHistory $leadActionHistory */
                $leadActionHistory = LeadActionHistory::query()
                    ->where('lead_id', $lead->id)
                    ->where('deal_action_id', $nextHorizontal->id)
                    ->first();
                if ($leadActionHistory) {
                    return false;
                }
            }
        }

        $nextAction = $this->getNextVerticalAction();
        if ($nextAction) {
            $nextAction->scheduleAction($lead);
            return true;
        } else {
            \Log::info('No next action found for action ' . $this->id . ' and lead ' . $lead->id);
        }

        return  false;
    }

    /**
     * @param Lead $lead
     * @return bool
     */
    public function scheduleNextAction(Lead $lead) {
        if ($this->isHorizontal()) {
            return $this->scheduleNextHorizontalAction($lead);
        }

        if ($this->isVertical()) {
            return $this->scheduleNextVerticalAction($lead);
        }

        return false;
    }

    public function scheduleAction(Lead $lead) {
        $leadActionHistory = LeadActionHistory::query()
            ->where('lead_id', $lead->id)
            ->where('deal_action_id', $this->id)
            ->where('is_completed', 1)->first();

        if ($leadActionHistory) {
            \Log::info('Action already completed for lead ' . $lead->id . ' and action ' . $this->id);
            return;
        }

        if (!$leadActionHistory) {
            $leadActionHistory = new LeadActionHistory();

            $leadActionHistory->fill([
                'lead_id' => $lead->id,
                'deal_action_id' => $this->id,
                'is_completed' => 0,
            ]);
            $leadActionHistory->save();
        }

        $minutes = ceil($this->delay_time/60);
        DealActionJob::dispatch($leadActionHistory)
            ->delay(
                now()->addMinutes($minutes)
            )
            ->onQueue('actions');
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

    /**
     * Is this action horizontal
     *
     * @param Lead $lead
     * @return void
     */
    public function isHorizontal() {
        return $this->is_root < 1;
    }

    /**
     * Is this action a vertical action
     *
     * @return bool
     */
    public function isVertical() {
        return $this->is_root > 0;
    }
}
