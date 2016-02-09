# restheart-mobile-example

A simple hybrid mobile app example with restheart and ionic.

## Clone this repository locally

	$ git clone https://github.com/SoftInstigate/restheart-mobile-example.git
	$ cd restheart-example-example

## Install mongodb and RESTHeart

For detailed installation instructions refer to the [documentation](http://restheart.org/docs/get-up-and-running.html).

However the quickest way is using **docker**:

	$ docker pull mongo
	$ docker pull softinstigate/restheart
	$ docker run -d --name mongodb mongo:3.0
	$ docker run -d -p 8080:8080 --name restheart --link mongodb:mongodb softinstigate/restheart

After the docker mongodb and restheart containers are started in background, you can check the logs by issuing the `docker logs` command

	$ docker logs mongodb
	$ docker logs restheart

Then you might need to adjust the RESTHEART_URL variable value in the following file:

	app/scripts/app.js
	
Edit this line:

	var RESTHEART_URL = "http://192.168.59.103:8080";

Setting the IP (in this case 192.168.59.103, which should be the one with boot2docker) with the one of the restheart container; it might be the `localhost` or, if you are using boot2docker, you can retrive it with the command:

	boot2docker ip
	
If you are using `docker-machine` and let's say the default VM is called "default" then

	$ docker-machine ip default
	192.168.99.100

## Create the data model

We will be using the RESTHeart API with [httpie](http://httpie.org) (you can also use another http client such as curl)

Creating the database:

	$ http -a admin:changeit PUT http://192.168.99.100:8080/ari descr="restheart ionic app example db"
	
	HTTP/1.1 201 Created
	...

Creating the collection:

	$ http -a admin:changeit PUT http://192.168.99.100:8080/ari/poi descr="point of interest collection"
	
	HTTP/1.1 201 Created
	...

Adding some documents:

	$ http -a admin:changeit PUT http://192.168.99.100:8080/ari/poi/milan lat=45.460633 lng=9.183028
	
	HTTP/1.1 201 Created
	...
	
	$ http -a admin:changeit PUT http://192.168.99.100:8080/ari/poi/venice lat=45.434167 lng=12.338472
	
	HTTP/1.1 201 Created
	...
	
	$ http -a admin:changeit PUT http://192.168.99.100:8080/ari/poi/rome lat=41.902701 lng=12.496245
	
	HTTP/1.1 201 Created
	...
	
	


## Start the Ionic app

First of all you have to install Node.js for your system [https://nodejs.org](https://nodejs.org).


Install [Grunt](http://gruntjs.com/getting-started) and [Bower](http://bower.io) tools

	npm install -g bower grunt-cli


Run `bower install`. If Bower asks you for the AngularJS version, choose 1.3.0.

	bower install

If you want to preview the web application, run `ionic serve`; after a while it should starts the default browser at [http://localhost:8100/](http://localhost:8100/).
Of course, make sure you have already started RESTHeart as well.

	ionic serve

To login in the Web app, you can use the **admin** user with password **changeit**

For more information on RESTHeart security setting refer to the [documentation](http://restheart.org/docs/security.html).

## Emulate the app

Running `ionic emulate ios` you will emulate the app but before doing that you have to add the ios platform with the command `ionic platform add ios` and build using the command `ionic build ios`.

	ionic platform add ios
	ionic build ios
	ionic emulate ios

Make sure to substitute ios with android to build for Android.

	ionic platform add ios
	ionic build ios
	ionic emulate ios

<hr></hr>

_Made with :heart: by [The SoftInstigate Team](http://www.softinstigate.com/). Follow us on [Twitter](https://twitter.com/softinstigate)_.