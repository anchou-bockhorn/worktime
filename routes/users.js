var express = require('express');
var router = express.Router();

/*
 * GET userlist.
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});


/*
 * POST to adduser.
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
* PUT to updateuser
*/
router.put('/updateuser/:id/', function(req, res) {
var db = req.db;
var collection = db.get('firstnode');

if (req.body.reason == 'status') {
    db.collection('userlist').findAndModify({
        query: { _id: req.params.id },
        sort: {  },
        update: { '$set': { 'status': req.body.status } }
    })
} else if (req.body.reason == 'timestamp') {
    console.log(req.body);
    keyval = req.body.timestamp;
    key = req.body.timestamp_id;
    var set = {};
    set['timestamp.'+key] = keyval;
    db.collection('userlist').update({"_id":req.params.id},{$set: set })
}


});
module.exports = router;
