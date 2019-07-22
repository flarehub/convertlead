<?php

use Illuminate\Database\Seeder;

class AdminUserSeed extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::getPdo()->query('SET FOREIGN_KEY_CHECKS=0;');
        \Illuminate\Support\Facades\DB::query("
            DELETE FROM users WHERE email = 'alex.hypetutor@gmail.com'
        ");
        DB::getPdo()->query('SET FOREIGN_KEY_CHECKS=1;');

        \App\Models\User::create([
            'email' => 'admin.alex@test.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_ADMIN,
        ]);
          \App\Models\User::create([
              'email' => 'admin.dmitri@test.com',
              'name' => 'Dmitri Russu',
              'password' => bcrypt('testtest'),
              'role' => \App\Models\User::$ROLE_ADMIN,
          ]);
    }
}
