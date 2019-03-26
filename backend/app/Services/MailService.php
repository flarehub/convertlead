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
    public static function sendMail($template, $params, $email, $subject, $attachment = null) {
        if(isEnvironment('testing')) {
            $email = env('MAIL_TEST_ADDRESS', 'dmitri.russu@codefactorygroup.com');
        }
        
        $mail = Mail::send($template, $params, function ($m) use ($email, $subject, $attachment) {
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
    }

    /**
     * Send an error notification
     * 
     * @param type $exception
     * @param type $subject
     */
    public static function sendErrorNotification($exception, $subject = null) {
        $to = env('MAIL_ERROR_NOTIFY', 'logs@e3creative.co.uk');

        if($subject === null) {
            $subject = 'IMPORTANT - Site Down: Volution - Error Code 500'; 
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
    }
}
