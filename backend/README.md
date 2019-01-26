# Leads aggregator app v0.1

#### Setup env file
````
$ cp .env.dev .env
````
#### Generate private application key
````
$ php artisan key:generate
````
### Setup database 
```
$ php artisan migrate
```
### Install authorization 
````
$ php artisan passport:install
$ php artisan passport:keys --force

````
#### Run app
````
$ php artisan serve
````
#### HELP
````
$ php artisan help
