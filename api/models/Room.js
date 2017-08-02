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
    gameOn : {type: 'boolean'},
    usedGaali : {type : 'array'}
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
      Room.find(req).exec(function(err, res){
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
              var user = {
                  id : req.userId,
                  username : req.username,
                  points : 0,
                  admin : false,
                  ready : false
              }
              room.users.push(user);
              room.save(function(err){
                  if(err)
                    cb('Try Again');
                  else{
                      Room.publishUpdate(req.roomId, {total:room.total, max_limit:room.max_limit, newUser:user});
                      cb(null, 'updated');
                  } 
              });
          }
      })
  },

  ready : function(req, cb){
      Room.findOne(req.roomId).exec(function(err, room){
          if(err)
            return cb('error in update');
          else if(req.userId){
              var pos;
              console.log('requested',req);
              _.each(room.users, function(user, index){
                  console.log('user', user.id, req.userId);
                  if(user.id==req.userId){
                    user.ready = req.ready;
                    pos = index
                  }
              });
              console.log('array', room.users);
              room.ready+=req.ready?1:-1;
              room.save(function(err){
                  if(err)
                    cb(err);
                  else{
                      Room.publishUpdate(req.roomId, {id:req.userId, index:pos, ready:req.ready});
                      if(room.ready==room.max_limit){
                        Room.publishUpdate(req.roomId, {start:true});
                        sails.controllers.room.playGame({body:{id:req.roomId}});
                      }
                      cb(null, 'ready updated');
                  }
              })
          }
          else cb('error in request');
      });
  },

  points : function(req, cb){
      Room.findOne(req.roomId).exec(function(err, room){
          if(err)
            return cb('error in update');
          else if(req.userId){
              var pos;
              console.log('requested',req);
              _.each(room.users, function(user, index){
                  console.log('user', user.id, req.userId);
                  if(user.id==req.userId){
                    user.points += req.points;
                    pos = index;
                    req.points= user.points;
                  }
              });
              if(!room.usedGaali)
                room.usedGaali=[];
              room.usedGaali.push(req.gaali);
              room.save(function(err){
                  if(err)
                    cb(err);
                  else{
                      Room.publishUpdate(req.roomId, {id:req.userId, index:pos, points:req.points});
                      cb(null, 'points updated');
                  }
              })
          }
          else cb('error in request');
      });
  },

  gameOn : function(req, cb){
      if(req.check && req.id){
            Room.findOne(req.id).exec(function(err, resp){
                if(err)
                    return cb(err);
                if(!resp.gameOn || resp.gameOn==false){
                    resp.gameOn = true;
                    resp.save(function(err){
                        if(err)
                            return cb(err);
                        cb(null, {gameOn: false});
                    });
                }
                else if(resp.gameOn == true)
                    cb(null, {gameOn:true});
            });
      }
  },

  delete : function(req, cb){
      Room.destroy(req).exec(function(err, resp){
          if(err)
            return cb(err);
          cb(null, resp);
      })
  }
};

          