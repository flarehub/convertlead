# Leads aggregator app v0.1

#### Setup env file
````bash
$ cp .env.dev .env
````
### Setup database 
```bash
$ php artisan migrate
```
#### Generate private application key
````bash
$ php artisan key:generate
````
### Install authorization 
````bash
$ php artisan passport:install
$ php artisan passport:keys --force

````
###COPY APP KEY to .env.dev or .env.prod
````bash
APP_CLIENT_ID=2
APP_CLIENT_SECRET=gjlU21LYRB64wXHTdM8WZ8BFaqEB3hHzBs5KvYCp
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
