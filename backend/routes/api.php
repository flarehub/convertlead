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
Route::middleware(['auth:api', 'scopes:manage-leads'])->prefix('v1')
    ->group(function () {
        
        Route::group([ 'namespace' => 'Api\Management'], function () {
            Route::apiResource('agencies', 'AgencyController');
            Route::prefix('agencies/{agency}/')->group(function () {
                Route::apiResource('companies', 'CompanyController');
            });
        });
    });

Route::group(['namespace' => 'Auth'], function () {
    Route::post('/login', 'ApiLoginController@login');
});
