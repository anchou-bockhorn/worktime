var express = require('express');
var router = express.Router();
/*
 * GET all sessions.
 */
router.get('/', function(req, res) {
    var db = req.db;
    var collection = db.get('sessions');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 *  POST for new session
 */
router.post('/newsession/:id', function(req, res) {
    var ts = +new Date();
    var dO = new Date();
    var sessionObj = {userId:req.params.id, status:0, date:{timestamp:ts, dateObj:dO}};
    var db = req.db;
    var collection = db.get('sessions');
    collection.insert(sessionObj, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});


module.exports = router;