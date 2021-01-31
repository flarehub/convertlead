<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsNewFlagForDealActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('lead_notes', function (Blueprint $blueprint) {
            $blueprint->integer('deal_action_id')->nullable()->unsigned();
            $blueprint->boolean('is_new')->default(1);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('lead_notes', function (Blueprint $blueprint) {
            $blueprint->dropColumn('deal_action_id');
            $blueprint->dropColumn('is_new');
        });
    }
}
