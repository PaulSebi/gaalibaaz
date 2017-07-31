/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
    username : {type : 'string', unique:true, required:true},
    passcode : {type : 'string'},
    details : {},
    leaderboards : {type : 'integer'},
    room : {
        model : 'Room'
    }, 
  },
  
  beforeCreate : function(req, next){
    bcrypt.genSalt(10, function(err, salt){
        if(err) return next(err);
        bcrypt.hash(req.passcode, salt, function(err, hash){
            if(err) return next(err);
            req.passcode = hash;
            delete req.password;
            next();
        });
    });
  },

  insert : function(req, cb){
    if(typeof req.username == 'string' && typeof req.passcode == 'string'){
      User.create(req).exec(function(err, res){
          if(err)
             return cb(err);
          delete res.updatedAt;
          delete res.passcode;
          cb(null, res);
      });   
    }
    else cb({err:'bad request'});
  },

  fetchOne : function(req, cb){
      if(req){
        User.findOne(req).exec(function(err, res){
            if(err)
              cb(err);
            else if(res == null)
              cb(null, err);
            else{
                delete res.createdAt;
                delete res.updatedAt;
                cb(null, res);
            }
        });
      }
      else cb({error:'bad request'});
  },

  fetchLB : function(cb){
        User.find({sort:'leaderboards DESC', limit:10, select:['username', 'leaderboards']}).exec(function(err, res){
          if(err)
            return cb(err);
          cb(null, res);
        });
  },

  updateDetails : function(req, cb){
      if(req.id && req.updates){
        User.update(req.id, req.updates).exec(function(err, res){
          if(err)
            return cb(err);
          cb(null, res);
        })
      }
  }

};

