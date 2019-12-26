<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpireAtFieldForFbIntegration extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deal_campaign_facebook_integrations', function (Blueprint $table) {
            $table->timestamp('fb_token_expire_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deal_campaign_facebook_integrations', function (Blueprint $table) {
            $table->dropColumn('fb_token_expire_at');
        });
    }
}
