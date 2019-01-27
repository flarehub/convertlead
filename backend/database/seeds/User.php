<?php

use Illuminate\Database\Seeder;
use Faker\Generator as Faker;

class User extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->truncateTabales();
    
        $agency = \App\Models\Agency::create([
            'email' => 'dmitri.russu@gmail.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_AGENCY,
        ]);
        $agent = \App\Models\Agent::create([
            'email' => 'russu.dmitri@gmail.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_AGENT,
        ]);
        
        $company =   \App\Models\Company::create([
            'email' => 'russu.dmitri@test.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_COMPANY,
        ]);
        
        $agency->companies()->attach($company);
        $company->agents()->attach($agent);
    
        foreach ($agency->companies as $company) {
            factory(\App\Models\Deal::class, 200)->create()->each(function($deal) use ($company) {
                $deal->agency_company_id = $company->pivot->id;
                $deal->save();
            });
        }
        
        $this->createUsersPermissions($agency, $agent, $company);
    }
    
    /**
     * @param $agency
     * @param $agent
     * @param $company
     */
    public function createUsersPermissions($agency, $agent, $company)
    {
        $users = [$agency, $agent, $company,
            \App\Models\User::create([
                'email' => 'admin@test.com',
                'name' => 'Dmitri Russu',
                'password' => bcrypt('testtest'),
                'role' => \App\Models\User::$ROLE_ADMIN,
            ])
        ];
        foreach ($users as $user) {
            $permissions = \App\Models\Permission::whereIn('name', $user->getDefaultPermissions())->get();
            $user->permissions()->attach($permissions);
        }
    }
    
    public function truncateTabales()
    {
        if (env('ENV_NAME') === 'development') {
            DB::getPdo()->query('SET FOREIGN_KEY_CHECKS=0;');
            \App\Models\User::query()->truncate();
            DB::getPdo()->query('TRUNCATE TABLE user_permissions');
            DB::getPdo()->query('TRUNCATE TABLE company_agents');
            DB::getPdo()->query('TRUNCATE TABLE agency_companies');
            DB::getPdo()->query('TRUNCATE TABLE deals');
            DB::getPdo()->query('SET FOREIGN_KEY_CHECKS=1;');
        }
    }
}
