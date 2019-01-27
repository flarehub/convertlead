<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(PermissionsSeed::class);
        $this->call(LeadStatuses::class);
        $this->call(User::class);
    }
}
