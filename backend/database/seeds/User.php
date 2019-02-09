<?php

use Illuminate\Database\Seeder;

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
            'email' => 'dmitri.russu+ag@gmail.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_AGENT,
        ]);
        
        $company =   \App\Models\Company::create([
            'email' => 'dmitri.russu+cp@gmail.com',
            'name' => 'Dmitri Russu',
            'password' => bcrypt('testtest'),
            'role' => \App\Models\User::$ROLE_COMPANY,
        ]);
        
        $agency->companies()->attach($company);
        $company->agents()->attach($agent);
    
        foreach ($agency->companies as $company) {
            factory(\App\Models\Deal::class, 10)->create()->each(function($deal) use ($company) {
                $deal->agency_company_id = $company->pivot->id;
                $deal->save();
            });
        }
    
        factory(\App\Models\Agency::class, 10)->create([
            'role' => \App\Models\User::$ROLE_AGENCY
        ])->each(function ($agency) {
            $this->addPermissions($agency);

            $companies = factory(\App\Models\Company::class, 10)
                ->create(['role' => \App\Models\User::$ROLE_COMPANY])
                ->each(function ($company) {
                    $this->addPermissions($company);
                    
                    $agents = factory(\App\Models\Agent::class, 10)
                        ->create(['role' => \App\Models\User::$ROLE_AGENT])
                        ->each(function ($agent) {
                            $this->addPermissions($agent);
                        });
    
                    $company->agents()->attach($agents);
                });

            $agency->companies()->attach($companies);

            foreach ($agency->companies as $company) {
                factory(\App\Models\Deal::class, 10)->create()->each(function($deal) use ($company) {
                    $deal->agency_company_id = $company->pivot->id;
                    $deal->save();
    
    
                    factory(\App\Models\DealCampaign::class, 10)->create([
                        'company_id' => $company->id,
                        'deal_id' => $deal->id,
                    ])->each(function (\App\Models\DealCampaign $dealCampaign) use ($company) {
                        foreach ($company->agents as $agent) {
                            $dealCampaign->agents()->attach($agent);
                        }
                        factory(\App\Models\Lead::class, 10)->create([
                            'deal_campaign_id' => $dealCampaign->id,
                            'company_id' => $company->id,
                        ]);
                    });
                });
            }
        });
        
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
            $this->addPermissions($user);
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
    
    /**
     * @param $user
     */
    public function addPermissions($user)
    {
        $permissions = \App\Models\Permission::whereIn('name', $user->getDefaultPermissions())->get();
        $user->permissions()->attach($permissions);
    }
}
