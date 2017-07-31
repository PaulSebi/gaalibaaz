/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	insert : function(req, res){
        if(req.method == 'POST' && req.isSocket){
            if(req.body.admin){
                var data = {
                    max_limit : req.body.max_limit,
                    users : [{
                        id : req.body.id,
                        username : req.body.username,
                        stars : '*****',
                        ready : false
                    }],
                    ready : 0,
                    total : 1
                }
                Room.insert(data, function(err, resp){
                    if(err)
                        return res.json({error:err, result:null});
                    res.json({error:null, result:resp});
                })
            }
            else{

            }    
        }
    },

    loadRooms : function(req, res){
        Room.fetch({select:['max_limit', 'total']}, function(err, resp){
            if(err)
                return res.json({error:err, result:null});
            else{
                if(resp!=null)
                    return res.view('gamerooms', {rooms:resp});
                return res.view('gamerooms', {rooms:[]});
            }
        });            
    },

    subscribe : function(req, res){
        Room.watch(req);
        Room.fetch({select:['id']}, function(err, resp){
            if(err)
                return res.json({error:err, result:null});
            else{
                if(resp!=null){
                    Room.subscribe(req, _.pluck(resp, 'id'));
                    return res.json({error:null, result:true});
                }
                else return res.json({error:'unknown error', result:null});
            }
        });
    },

    updateUsers : function(req, res){
        if(req.method == 'PUT' && req.isSocket){
            Room.updateUsers(req.body, function(err, resp){
                if(err)
                    return res.json({error:err, result:null});
                res.json({error:null, result:resp});
            })
        }
    }
};

