# Leads aggregator app v0.1

#### Setup env file
````bash
$ cp .env.dev .env
````
#### Generate private application key
````bash
$ php artisan key:generate
````
### Setup database 
```bash
$ php artisan migrate
```
### Install authorization 
````bash
$ php artisan passport:install
$ php artisan passport:keys --force

````

#### Run SEEDS
````bash
$ php artisan db:seed
````
#### Run app
````bash
$ php artisan serve
````
#### HELP
````bash
$ php artisan help
