<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Stripe, Mailgun, SparkPost and others. This file provides a sane
    | default location for this type of information, allowing packages
    | to have a conventional place to find your various credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
    ],

    'ses' => [
        'key' => env('SES_KEY'),
        'secret' => env('SES_SECRET'),
        'region' => env('SES_REGION', 'us-east-1'),
    ],

    'sparkpost' => [
        'secret' => env('SPARKPOST_SECRET'),
    ],

    'stripe' => [
        'model' => App\User::class,
        'key' => env('STRIPE_KEY'),
        'secret' => env('STRIPE_SECRET'),
    ],

    'fcm' => [
        'api_key' => env('FCM_API_KEY', 'AAAAHpXnaxc:APA91bFZyyXvBnUCufCFYJ4AH1dG6JaAwrCA5z4tIiQ1b8blji5P6EW2NYpZY_MFvc3xRaCBed4tfLmCHYnthUy2ukPl5eL4rHW8ygzG9QnOppidtAYRce1mBp-B30jVMyByHvJAyO-o'),
    ]

];
