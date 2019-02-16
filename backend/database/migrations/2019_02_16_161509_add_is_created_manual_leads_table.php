<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsCreatedManualLeadsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('deal_campaigns', function (Blueprint $table) {
            $table->string('integration', 100)->nullable()->after('uuid');
            $table->unique(['deal_id', 'agency_company_id', 'integration']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('deal_campaigns', function (Blueprint $table) {
            $table->dropColumn('integration');
        });
    }
}
