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
Route::middleware(['auth:api', 'auth-user'])->prefix('v1')
    ->group(/**
     *
     */
        function () {
        Route::group(['namespace' => 'Api\Management'], function () {
            Route::apiResource('profile', 'ProfileController');
        });
        
        Route::group(['namespace' => 'Api\Management\Admin'], function () {
            Route::prefix('admin')->group(function () {
                Route::apiResource('users', 'UserController');
            });
        });
        
        Route::group(['namespace' => 'Api\Management\Agency'], function () {
            Route::prefix('agency')->group(function () {
                Route::get('deals', 'DealController@all');
                Route::get('agents', 'AgentController@all');
                Route::get('leads', 'LeadController@all');
                Route::apiResource('companies', 'CompanyController');
                Route::patch('companies/{company}/lock-status', 'CompanyController@lockStatus');
                Route::apiResource('companies/{company}/deals', 'DealController');
                Route::apiResource('companies/{company}/agents', 'AgentController');
                Route::apiResource('companies/{company}/leads', 'LeadController');
            });
        });
        
        Route::group(['namespace' => 'Api\Management\Agent'], function () {
            Route::prefix('agent')->group(function () {
                Route::apiResource('deals', 'DealController')->middleware('scope:DEAL_READ')->only(['index', 'show']);
                Route::apiResource('deals', 'DealController')->middleware('scope:DEAL_WRITE')->only(['update', 'store', 'delete']);
                Route::apiResource('devices', 'DeviceController')->middleware('scope:DEVICE_READ,DEVICE_WRITE');
                Route::apiResource('leads', 'LeadController')->middleware('scope:LEAD_READ,LEAD_WRITE');
                Route::apiResource('leads/{lead}/notes', 'LeadNoteController')->middleware('scope:LEAD_NOTE_READ,LEAD_NOTE_WRITE');
            });
        });
        
        Route::group(['namespace' => 'Api\Management\Company'], function () {
            Route::prefix('company')->group(function () {
                Route::apiResource('agents', 'AgentController')->middleware('scope:AGENT_READ')->only(['index', 'show']);
                Route::apiResource('agents', 'AgentController')->middleware('scope:AGENT_WRITE')->only(['store', 'update', 'delete']);
                Route::apiResource('deals', 'DealController')->middleware('scope:DEAL_READ')->only(['index', 'show']);
                Route::apiResource('deals', 'DealController')->middleware('scope:DEAL_WRITE')->only(['store', 'update', 'delete']);
                
                Route::apiResource('deals/{deal}/campaigns', 'CampaignController')
                    ->middleware('scope:CAMPAIGN_READ,CAMPAIGN_WRITE');
                Route::apiResource('campaigns/{campaign}/integration', 'CampaignIntegrationController')
                    ->middleware('scope:CAMPAIGN_READ,CAMPAIGN_WRITE');
                Route::apiResource('campaigns/{campaign}/leads', 'LeadController')->middleware('scope:LEAD_READ,LEAD_WRITE');
                Route::apiResource('leads/{lead}/notes', 'LeadController')->middleware('scope:LEAD_NOTE_READ,LEAD_NOTE_WRITE');
            });
        });
    });

Route::group(['namespace' => 'Auth'], function () {
    Route::post('login', 'ApiLoginController@login');
});

Route::group(['namespace' => 'Api\Management'], function () {
    Route::prefix('v1')->group(function () {
        Route::post('agencies', 'AgencyController@store');
        
        Route::group(['namespace' => 'Api\Management\Company'], function () {
            Route::prefix('company')->group(function () {
                Route::post('campaigns/callback/{integrationUUID}', 'LeadController@store');
            });
        });
    });
});