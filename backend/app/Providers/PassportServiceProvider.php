<?php
/**
 * Created by PhpStorm.
 * User: dmitri
 * Date: 1/27/19
 * Time: 9:55 PM
 */

namespace App\Providers;


use App\Repositories\UserRepository;
use App\Services\Passport\PasswordGrant;
use Laravel\Passport\Bridge\RefreshTokenRepository;
use Laravel\Passport\Passport;

class PassportServiceProvider extends \Laravel\Passport\PassportServiceProvider {
    
    /**
     * Create and configure a Password grant instance.
     *
     * @return \League\OAuth2\Server\Grant\PasswordGrant
     */
    protected function makePasswordGrant()
    {
        $grant = new PasswordGrant(
            $this->app->make(UserRepository::class),
            $this->app->make(RefreshTokenRepository::class)
        );
        
        $grant->setRefreshTokenTTL(Passport::refreshTokensExpireIn());
        
        return $grant;
    }
}