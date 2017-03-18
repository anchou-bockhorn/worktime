var express = require('express');
var router = express.Router();





/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'V T T' });
});

/*
 * GET test.
 */

router.get('/stamps/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var response = ""
    collection.find({'_id':req.params.id},{},function(e,docs){
        for (var i = 0; i<docs.length; i++){
            console.log(docs[0].timestamp);
        }
        res.send(docs[0].timestamp);
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
var userToUpdate = req.params.id;

if (req.body.reason == 'status') {
    db.collection('test').findAndModify({
        query: { _id: req.params.id },
        sort: {  },
        update: { '$set': { 'status': req.body.status } }
    })
} else if (req.body.reason == 'timestamp') {
    console.log(req.body);
    keyval = req.body.timestamp;
    key = req.body.timestamp_id;
    var path = "timestamp."+key;
    var set = {};
    set['timestamp.'+key] = keyval;
    db.collection('test').update({"_id":req.params.id},{$set: set })
};


})
module.exports = router;
