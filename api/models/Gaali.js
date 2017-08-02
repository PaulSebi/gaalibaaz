/**
 * Gaali.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// var sane = require('saneconsole');
// var console = sane('Gaali Module');

module.exports = {

  attributes: {
    title : {type : 'string', unique:true, required:true},
    language : {type : 'string', required:true},
    rated : {type : 'float'},
    ratedBy : {type : 'integer'}
  },

  insert : function(req, callback){
    console.log(req.rated, typeof req.rated);
    if(typeof req == 'object' || typeof req.title == 'string'){
      Gaali.create(req).exec(function(err, res){
          if(err)
            return callback(err);
          callback(null, res);
      });
    }
    else callback({err : 'Too few parameters'});
  },

  fetch : function(req, callback){
      if(typeof req == 'object'){
          Gaali.find(req).exec(function(err, res){
              if(err)
                return callback(err);
              callback(null, res);
          });
      }
  },

  restrictedFetch : function(req, callback){
    console.log('requested', JSON.stringify(req));
    async.waterfall([
      function(cb){
          Gaali.count({language: req.languages}).exec(function(err, res){  
              return cb(null, res);
          });
        },
      function(count, cb){
          Gaali.find({id : {'!' : req.not}, language: req.languages, select:req.select}).limit(req.limit).skip(Math.random()*(count-req.limit)).exec(function(err, res){
              console.log('retrieve\n', res);
              if(err)
                return cb(err);
              cb(null, res);
          })
        }
    ], function(err, res){
        if(err)
          return callback(err);
        callback(null, res);
    }); 
  },

  put : function(req, callback){
    // console.log('requested',req.updates, req.ids);
    if(req.update && req.id){
      Gaali.update(req.id, req.update).exec(function(err, res){
        if(err)
          return callback(err);
        console.log('res1',res);
        callback(null, res);
      });
    }
    else callback({err:'Not enough params'});
  }
};

