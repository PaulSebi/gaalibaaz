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
                        points : 0,
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
        if(req.query){
            console.log('requested', req.query);
            Room.subscribe(req, req.query.id);
            return res.json({error:null, result:{id:req.query.id, subscribed:true}});
        }
        Room.watch(req);
        Room.fetch({select:['id'], where:{}}, function(err, resp){
            if(err)
                return res.json({error:err, result:null});
            else{
                if(resp!=null){
                    Room.subscribe(req, _.pluck(resp, 'id'));
                    return res.json({error:null, result:{subscribed:true}});
                }
                else return res.json({error:'unknown error', result:null});
            }
        });
    },

    updateUsers : function(req, res){
        if(req.method == 'PUT' && req.isSocket){
            if(typeof req.body.ready=='boolean'){
                Room.ready(req.body, function(err, resp){
                    if(err)
                        return res.json({error:err, result:null});
                    res.json({error:null, result:resp});
                });
            }
            else{
                Room.updateUsers(req.body, function(err, resp){
                    if(err)
                        return res.json({error:err, result:null});
                    res.json({error:null, result:resp});
                });
            }
        }
        
    },

    loadGame : function(req, res){
        console.log('query', req.query);
        Room.fetch({id:req.query.id}, function(err, resp){
            if(err)
                return res.json({error:err, result:null});
            resp = resp[0];
            res.view('game', {
                room : {
                    id : resp.id,
                    max_limit : resp.max_limit,
                    total : resp.total
                },
                users : resp.users
            });
        });
    },

    playGame : function(req){
        // console.log('here', req.isSocket);
        // if(req.isSocket){
            Room.gameOn({check:true, id:req.body.id}, function(err, resp){
                console.log('socket');
                if(err)
                    return res.json({error:err, result:null});
                else if(resp.gameOne)
                    return res.json(null, {error:null, result:{resp}});
                async.waterfall([
                    function(cb){
                        var i = 0;
                        console.log('inside');
                        var timer = setInterval(function(){
                            console.log(i, req.body.id);
                            Room.message(req.body.id, {tick:i});
                            i++;
                            if(i>30){
                                clearInterval(timer);
                                cb(null,{success:true});
                            }
                        }, 1000);
                    },
                    function(cb){
                        Room.message(req.body.id, {tick:-1});
                        Room.fetch({id:req.body.id, select:['users']}, function(err, resp){
                            if(err)
                                return cb(err);
                            var winner = {
                                points : 0,
                                username : 'noone',
                                id : ''
                            }
                            _.each(resp[0].users, function(user){
                                if(user.points>winner.points){
                                    winner.points = user.points;
                                    winner.username = user.username;
                                    winner.id = user.id;
                                }
                            });
                            Room.message(req.body.id, {winner:winner});
                            Room.destroy({id:req.body.id}, function(err, resp){
                                if(err)
                                    return;
                                return;
                            });
                        });
                    }
                ]);  
            });
        // }
    },

    submitGaali : function(req, res){
        if(req.isSocket){
            async.waterfall([
                function(cb){
                    Room.fetch({id:req.body.roomId, select:['usedGaali']}, function(err,resp){
                        if(err)
                            return cb(err);
                        else if(!resp[0].usedGaali || resp[0].usedGaali.indexOf(req.body.gaali)==-1)
                            cb(null, null);
                        else return cb('already used');
                    })
                },
                function(less, cb){
                    Gaali.fetch({title:req.body.gaali, select:['rated']}, function(err, resp){
                        if(err)
                            return cb('Not Accepted');
                        else if(resp[0]){
                            console.log(resp);
                            cb(null, resp[0].rated);
                        }
                        else cb('no such gaali');
                    });
                },
                function(rated, cb){
                    if(rated>0){
                        Room.points({
                            roomId:req.body.roomId,
                            userId:req.body.userId,
                            points:rated,
                            gaali:req.body.gaali
                        }, function(err, resp){
                            if(err)
                                return cb({error:'unknown error', result:null});
                            Room.message(req.body.roomId, {gaali:req.body.gaali}, req);
                            cb(null, 'done')
                        });
                    }
                }
            ], function(err, results){
                res.json({error:err, result:results});
            });
        }
    }

};

