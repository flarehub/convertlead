<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

Class MailService {
    /**
     * Send a email
     * @param type $template
     * @param type $params
     * @param type $email
     * @param type $subject
     * @param type $attachment
     * @return boolean
     */
    public static function sendMail($template, $params, $email, $subject, $cc = null, $attachment = null) {
        if(env('testing', false)) {
            $email = env('APP_MAIL_TEST_ADDRESS', 'dmitri.russu@gmail.com');
        }
        try {
            $mail = Mail::send($template, $params, function ($m) use ($email, $subject, $cc, $attachment) {
                if ($cc) {
                    $m->cc($cc);
                }
                $m->to($email)
                    ->subject($subject)
                    ->priority(1);
                if($attachment) {
                    $m->attach($attachment);
                }

            });

            if ($mail) {
                return true;
            }
        } catch (\Exception $exception) {
            \Log::critical($exception->getMessage());
        }
        return false;
    }

    /**
     * Send an error notification
     * 
     * @param type $exception
     * @param type $subject
     */
    public static function sendErrorNotification($exception, $subject = null) {
        try {
            $to = env('MAIL_ERROR_NOTIFY', 'dmitri.russu@gmail.com');

            if($subject === null) {
                $subject = 'IMPORTANT - Site Down: Lead aggregator - Error Code 500';
            }

            $mail = Mail::send('emails.error-notification', ['exception' => $exception], function ($m) use ($to, $subject) {
                $m->to($to)
                    ->subject($subject)
                    ->priority(1)
                    ->subject($subject);
            });

            if ($mail) {
                return true;
            }
        } catch (\Exception $exception) {
            \Log::critical($exception->getMessage());
        }
        return false;
    }
}
