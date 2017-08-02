/**
 * GaaliController
 *
 * @description :: Server-side logic for managing gaalis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
   insert : function(req, res){
        async.map(req.body, function(gaali, cb){
            Gaali.insert(gaali, function(err, resp){
                if(err || resp == null)
                    return cb(null);
                cb(null, resp);
            });
        }, function(err, results){
            if(err)
                return res.json({error:err, result:null});
            res.json({error: null, result:{inserted : true, values : results}});
        });
    },

    fetch : function(req, res){
        Gaali.restrictedFetch(req, function(err, resp){
            if(err)
                return res.json({error: 'Error in Fetch', result : null});
            res.json({error:null, result: resp});
        });
    },

    fetchToRate : function(req, res){
        var request = {
            limit : 5,
            not : [],
            languages : req.query.languages,
            select : ['title', 'rated', 'ratedBy']
        }
        Gaali.restrictedFetch(request, function(err, resp){
            if(err)
                return res.json({error : err, result:null});
            res.view('rate',{gaalis:resp});
        });
    },
    
    updateRating : function(req, res){
        var ids = [], updates = [];
        console.log('requested', req.body);
        async.map(req.body, function(val, cb){
            var update = {
                id : val.id,
                update : {
                    rated : (val.ratedBy*val.rated+val.poll)/(val.ratedBy+1),
                    ratedBy : val.ratedBy+1
                }
            }
            console.log('update', update);
            Gaali.put(update, function(err, resp){
                if(err)
                    return cb(err);
                cb(null, resp);
            });
        }, function(err, results){
            if(err)
                return res.json({error:err, result:null});
            res.json({error:err, result:results});
        });
    },

    //req contains languages, not, limit
    jumbled : function(req, res){
        async.waterfall([
            function(cb){
                req = req.query;
                req.not = null;
                req.select = ['title'];
                console.log('requested',req);
                Gaali.restrictedFetch(req, function(err, resp){
                     if(err)
                        return cb({error : err});
                     cb(null, resp);
                });
            },
            function(list, cb){
                if(!list)   
                    return cb({error:'unknown error'});
                var str = "";
                _.each(list, function(item){
                    str+=item.title;
                });
                str = str.split('').sort(function(){return 0.5-Math.random()}).join('');
                var resp = {
                    ids : _.pluck(list, 'id'),
                    jumbled : str
                }
                cb(null, resp);
            }
        ], function(err, result){
            if(err)
                return res.json(err);
            res.json({error:null, result: result});
        });
    }
    
};

