/**
 * Room.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    max_limit : {type:'integer'},
    total : {type : 'integer'},
    ready : {type : 'integer'},
    users : {type : 'array'},
    //user : [{id:'xyz', username:'name', stars:'*****', ready:false}] 
  },

  insert : function(req, cb){
      Room.create(req).exec(function(err, resp){
          if(err)
            return cb(err);
          Room.publishCreate({
              id : resp.id,
              max_limit : resp.max_limit,
              total : resp.total
          });
          cb(null, resp);
      })
  },

  fetch : function(req, cb){
      Room.find().exec(function(err, res){
          if(err)
            return cb(err);
          else cb(null, res);
      });
  },

  updateUsers : function(req, cb){
      Room.findOne(req.roomId).exec(function(err, room){
          if(err)
              return cb('error in update');
          else{
              ++room.total;
              room.users.push({
                  id : req.userId,
                  username : req.username,
                  stars : '*****',
                  admin : false
              });
              room.save(function(err){
                  if(err)
                    cb('Try Again');
                  else{
                      Room.publishUpdate(req.roomId, {total:room.total});
                      cb(null, 'updated');
                  } 
              });
          }
      })
  }
};

          