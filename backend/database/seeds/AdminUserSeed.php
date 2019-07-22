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
        \Illuminate\Support\Facades\DB::query("
            DELETE FROM users WHERE role <> 'agent' AND email = 'alex.hypetutor@gmail.com'
        ");

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
