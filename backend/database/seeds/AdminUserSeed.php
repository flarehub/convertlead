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
            SET FOREIGN_KEY_CHECKS=0;
            DELETE FROM users WHERE email = 'alex.hypetutor@gmail.com';
            SET FOREIGN_KEY_CHECKS=1;
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
