<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::middleware(['auth:api'])->prefix('v1')
    ->group(function () {
        Route::group([ 'namespace' => 'Api\Management'], function () {
            Route::apiResource('profile', 'ProfileController');
        });
    
        Route::group([ 'namespace' => 'Api\Management\Admin'], function () {
            Route::prefix('admin')->group(function () {
                Route::apiResource('users', 'UserController');
            });
        });
        
        Route::group([ 'namespace' => 'Api\Management\Agency'], function () {
            Route::prefix('agency')->group(function () {
                Route::apiResource('companies', 'CompanyController');
                Route::apiResource('deals', 'DealController');
                Route::apiResource('companies/{company}/agents', 'AgentController');
            });
        });

        Route::group([ 'namespace' => 'Api\Management\Agent'], function () {
            Route::prefix('agent')->group(function () {
                Route::apiResource('deals', 'DealController');
                Route::apiResource('leads', 'LeadController');
                Route::apiResource('leads/{lead}/notes', 'LeadNoteController');
            });
        });

        Route::group([ 'namespace' => 'Api\Management\Company'], function () {
            Route::prefix('company')->group(function () {
               Route::apiResource('agents', 'AgentController');
               Route::apiResource('deals', 'DealController');
               Route::apiResource('deals/{deal}/campaigns', 'CampaignController');
               Route::apiResource('campaigns/{campaign}/integration', 'CampaignIntegrationController');
               Route::apiResource('campaigns/{campaign}/leads', 'LeadController');
               Route::apiResource('leads/{lead}/notes', 'LeadController');
            });
        });
    });

Route::group(['namespace' => 'Auth'], function () {
    Route::post('login', 'ApiLoginController@login');
});

Route::group([ 'namespace' => 'Api\Management' ], function () {
    Route::prefix('v1')->group(function () {
        Route::post('agencies', 'AgencyController@store');
    
        Route::group([ 'namespace' => 'Api\Management\Company'], function () {
            Route::prefix('company')->group(function () {
                Route::post('campaigns/callback/{integrationUUID}', 'LeadController@store');
            });
        });
    });
});