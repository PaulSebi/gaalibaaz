/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt');

module.exports = {
	insert : function(req, res){
        console.log('here', req.body);
        User.insert(req.body, function(err, resp){
            if(err)
                return res.json({error : err, result: null});
            res.json({error:null, result:resp});
        });
    },

    fetch : function(req, res){
        User.fetchOne(req.query.id, function(err, resp){
            if(err)
                return res.json({error: err, result : null});
            res.json({error : null, result : resp});
        })
    },

    fetchLeaderBoard : function(req, res){
        User.fetchLB(function(err, resp){
            if(err)
                return res.json({error: err, result : null});
            res.json({error : null, result : resp});
        })
    },

    //request contains id and whatever else
    updateDetails : function(req, res){
        User.updateDetails(function(err, res){
            if(err)
                return res.json({error:err, result:null});
            res.json({error : null, result:resp});
        });
    },

    login : function(req, res){
		async.waterfall([function(callback){
            var fetch = {username:req.body.username};
			User.fetchOne(fetch, function(err, resp){
				if(err){
					callback({error : err, result :null});
				}
				else if(resp == null){
					callback({error : 'no such user', result :null});
				}
				else callback(null, resp);
			});
		}, function(user, callback){

                console.log(req.body.passcode, user.passcode);
			bcrypt.compare(req.body.passcode, user.passcode, function(err, resp){
				if(err){
					callback({error : err, result :null});
				}
				else if(!resp){
					callback({error : 'mismatch', result :null});
				}
				else if(resp){
					delete user.passcode;
					// user.token = jwToken.issue({id:user.id, role:user.role, username:user.username});
					callback(null, user);
				}
			});
		}], function(err, result){
			if(err)
				return res.json(err);
			res.json({error:null, result:result});
		});
	}
};

