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
        $users = [
            \App\Models\User::create([
                'email' => 'admin.alex@test.com',
                'name' => 'Dmitri Russu',
                'password' => bcrypt('testtest'),
                'role' => \App\Models\User::$ROLE_ADMIN,
            ]),
        \App\Models\User::create([
            'email' => 'admin.dmitri@test.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_ADMIN,
        ]),
        \App\Models\User::create([
            'email' => 'admin@test.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_ADMIN,
        ]),
        ];
        foreach ($users as $user) {
            $this->addPermissions($user);
        }
    }

    /**
     * @param $user
     */
    public function addPermissions($user)
    {
        $permissions = \App\Models\Permission::whereIn('name', $user->getDefaultPermissions())->get();
        $user->permissions()->attach($permissions);
    }
}
