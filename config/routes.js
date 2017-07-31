/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  // 'GET /games' : 'GaaliController.fetchToRate',

  'POST /dev/v0/gaali' : 'GaaliController.insert',
  'GET /dev/v0/rateables' : 'GaaliController.fetchToRate', //returns view rate.ejs
  'PUT /dev/v0/rateables' : 'GaaliController.updateRating', 
  'GET /dev/v0/gaali/jumbled' : 'GaaliController.jumbled',

  'POST /dev/v0/users' : 'UserController.insert',
  'GET /dev/v0/users' : 'UserController.fetch',
  'POST /dev/v0/users/login' : 'UserController.login',  
  'GET /dev/v0/users/leaderboards' : 'UserController.fetchLeaderBoard',

  '/dev/v0/gamerooms' : 'RoomController.loadRooms', //returns view gamerooms.ejs
  'POST /dev/v0/rooms' : 'RoomController.insert',
  'PUT /dev/v0/rooms' : 'RoomController.updateUsers',
  'GET /dev/v0/rooms/subscribe' : 'RoomController.subscribe'

};
