<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;

class Device extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'device_token',
        'type',
    ];

    public static function createDeviceToken(Request $request) {
        try {
            \DB::beginTransaction();

            $request->merge([
                'agent_id' => $request->user()->id,
            ]);

            \Validator::validate($request->all(), [
                'device_token' => 'required|string|max:255',
                'type' => 'required|string|max:255',
            ]);


            $deviceToken = self::create($request->only([
                'agent_id',
                'device_token',
                'type',
            ]));

            \DB::commit();
            return $deviceToken;
        } catch (\Exception $exception) {
            \DB::rollBack();
            throw $exception;
        }
    }
}
