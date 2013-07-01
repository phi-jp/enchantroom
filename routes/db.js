
exports.roomlist = function(req,res) {
    var Room = require('../model').Room;
    Room.find({},'title number sumbnail summary count author',function(err,docs){
        if (err){
            res.send(null);
        }
        else {
            res.send(JSON.stringify(docs));
        }
    });
};

exports.roomCount = function(req,res){
    var Room = require('../model').Room;
    Room.findOne({number:req.query.room},'count',function(err,doc){
        if (err){
            res.send(null);
        }
        else {
            res.send(JSON.stringify(doc));
        }
    });
};


exports.usersroom = function(req,res) {
    var Room = require('../model').Room;
    Room.find({'author': req.session.userid},'title number',function(err,docs){
        if (err) {
            res.send([]);
        }
        else {
            res.send(JSON.stringify(docs));
        }
    });
};

exports.activeImage = function(req,res) {
    var Room = require('../model').Room;
    Room.findOne({number:req.query.roomNumber},'activeImage',function(err,doc){
        if(err) res.send(null);
        else res.send(JSON.stringify(doc));
    });
}

exports.marks = function(req,res){
    var Mark = require('../model').Mark(req.query.roomNumber);
    Mark.find({},function(err,docs){
        if (err) {
            res.send(null);
        }
        else {
            res.send(JSON.stringify(docs));
        }
    });
};

exports.chatLog = function(req,res) {
    var ChatLog = require('../model').ChatLog(req.query.roomNumber);
    ChatLog.find({},'userid comment',{sort:{'created':1}},function(err,docs){
        if (err) {
            res.send(null);
        }
        else {
            res.send(JSON.stringify(docs));
        }
    });
};

exports.addStar = function(req,res) {
    var ChatLog = require('../model').ChatLog(req.body.room);
    ChatLog.findOne({_id:req.body.id},function(err,doc){
        if(err) {
            res.send(false);
        }
        else {
            ChatLog.update({_id:req.body.id},{star:(doc.star!==null?doc.star+1:1)},
                {upsert:false,multi:true},function(err){
                    if(err) {
                        res.send(false);
                    }
                    else {
                        res.send(true);
                    }
            });
        }
    });
};

exports.starLog = function(req,res){
    var ChatLog = require('../model').ChatLog(req.query.room);
    ChatLog.find({star:{$gt:2}},'_id',{sort:{'created':1}},function(err,doc){
        if(err){
            res.send(null);
        }
        else {
            res.send(JSON.stringify(doc));
        }
    });
};

exports.images = function(req,res) {
    var Image = require('../model').Image;
    Image.find({room: req.query.room}, "path title", function(err,docs){
        if (err){
        }
        else {
            res.send(JSON.stringify(docs));
        }
    });
};


var uploadData = function(file) {
    var fs = require('fs');
    var path = require('path');
    var tmpPath = file.path;
    var savePath = "/uploaded/" + ~~(new Date/1000)/* + path.extname(file.name)*/;
    var targetPath = "./public" + savePath;
    fs.rename(tmpPath, targetPath, function(err){
        if (err) throw err;
    });
    return savePath;
};
exports.uploadData = uploadData;
exports.upload = function(req,res) {
    var file = req.files.img;
    var path = uploadData(file);
    var Image = require('../model').Image;
    var newImage = new Image({room:req.body.roomNumber, path:path, title:file.name});
    newImage.save(function(err){
        if (err) {
            res.send(false);
        }
        else {
            res.send(JSON.stringify({path:path,title:file.name}));
        }
    });
}

