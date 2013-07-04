var wshost = require('../config').WSHOST;

exports.create = function(req,res){
  if (req.session.flg) {
      res.render('newRoom', { title: 'enchantRoom', authed: req.session.flg, username: req.session.userid,wshost:wshost });
  }
  else {
      res.render('newRoom', { title: 'enchantRoomfalse', authed: req.session.flg,wshost:wshost });
  }
};

exports.init = function(req,res) {
    return ;
    
    if (req.session.flg === undefined) res.send({flg:false, code:9});
    
    var Room = require('../model').Room;
    Room.find({},'number', {sort:{number:-1}}, function(err,docs){
        var roomNumber = null;
        if (err) {
            res.send({flg:false,code:0});
        }
        else if (docs.length == 0) {
            roomNumber = 0;
        }
        else {
            roomNumber = docs[0].number + 1;
        }
        
        if (roomNumber === null) res.send({flg:false,code:1});
        
        
        var records = {number: roomNumber, title: req.body.title, author: req.session.userid, summary:req.body.summary};
        var file = req.files.sumbnail;
        if (file !== undefined){//file.length) {
            var upload = require('./db').uploadData;
            var path = upload(file);
            records.sumbnail = path;
        }
        else {
            records.sumbnail = '/images/noImage.png';
        }
        
        
        var newRoom = new Room(records);
        newRoom.save(function(err){
            if (err) {
                res.send({flg:false,code:2});
            }
            else {
                res.send({flg:true, room:roomNumber});
            }
        });
    });
};

