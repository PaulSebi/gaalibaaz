Gaaliyan
===================


Gaaliyan, a realtime multiplayer game that challenges users to cuss each other to test their cussing limits!

----------

**Quick Install**

Clone the repository in a directory 

    git clone https://github.com/PaulSebi/gaalibaaz

Install dependancies

    npm install

Run MongoDb
	
    (sudo) service mongod start

Send a request to the Server to fill Gaalis

 - Use the POST request in the following Postman Collection
	 - `https://www.getpostman.com/collections/a46d332675d862747cdb`
 - Send a `POST` request to `localhost:1337/dev/v0/gaali` with the contents of `gaalis.json` in the body

Lift the Sails and you're ready to Go! 

    nodemon / pm2 app.js / node app.js / sails lift

Visit `localhost:1337/` to see the app in action!

**note** 
> if error occurs during `npm install`, execute the following 
> `rm node_modules/sails` 
> `mkdir node_modules/sails`
> `npm install` 
