var express = require('express');
var router = express.Router();

/*
 * GET sessionId by userId
 */
router.get('/active/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('sessions');
    collection.find({'userId':req.params.id,'status':1},{'_id':1,'status':1},function (e,result) {
        console.log(result);
        res.send(
            result
        );
    })
});

/*
 * GET all sessions.
 */
router.get('/all', function(req, res) {
    var db = req.db;
    var collection = db.get('sessions');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST session by date filter.
 */
router.post('/filter', function(req, res) {
    var db = req.db;
    var filterObj = req.body;
    var collection = db.get('sessions');
    var startFilter = new Date(filterObj.syear, filterObj.smonth-1, filterObj.sday);
    var endFilter = new Date(filterObj.eyear, filterObj.emonth-1, filterObj.eday);
    console.log(endFilter);
    collection.find({
        $and: [
            {"date_started.dateObj_started": { $gte: new Date(startFilter) }},
            {"date_ended.dateObj_ended":{$lte: new Date(endFilter)}}
        ]
    },{},function(e,docs){

        console.log(docs);
        res.json(docs);
    });
});


/*
 *  POST for new session
 */
router.post('/new/:userId', function(req, res) {
    var ts = +new Date();
    var dO = new Date();

    var minute = dO.getMinutes();
    var hour = dO.getHours();
    var day = dO.getDate();
    var month = dO.getUTCMonth() + 1;
    var year = dO.getFullYear();

    var sessionObj = {
        userId:req.params.userId,
        status:1,
        date_started:{
            timestamp_started:ts,
            dateObj_started:dO
        },
        human_started:{
            minute:minute,
            hour:hour,
            day:day,
            month:month,
            year:year

        }
    };
    var db = req.db;
    var collection = db.get('sessions');
    collection.insert(sessionObj, function(err, result){
        console.log(result);
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


/*
 *  PUT to make lunch break
 */
router.put('/zmittag/:sid', function(req, res) {
    var db = req.db;
    var collection = db.get('sessions');
    collection.update({
            '_id':req.params.sid
        },
        {$inc:{zmittag:1}});
})


/*
 *  PUT to smoke a zigi
 */
router.put('/zigi/:sid', function(req, res) {
    var db = req.db;
    var collection = db.get('sessions');
    collection.update({
        '_id':req.params.sid
    },
        {$inc:{zigi:1}});
})
/*
 *  PUT to end session
 */
router.put('/end/:sid', function(req, res) {

    var ts = +new Date();
    var dO = new Date();

    var minute = dO.getMinutes();
    var hour = dO.getHours();
    var day = dO.getDate();
    var month = dO.getUTCMonth() + 1;
    var year = dO.getFullYear();



    var db = req.db;
    var collection = db.get('sessions');
    collection.update({'_id':req.params.sid},
        {$set:{
        status:0,
            date_ended:{
                timestamp_ended:ts,
                dateObj_ended:dO
            },
            human_ended:{
                minute:minute,
                hour:hour,
                day:day,
                month:month,
                year:year
            }


        }}, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
        console.log(result);
    });
});


module.exports = router;