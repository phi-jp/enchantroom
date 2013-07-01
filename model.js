/*
データベースドライバmongooseのSchema
*/

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/enchantroom');

function validator(v) { return v.length > 0; }
function validatorn(v) { return v !== null; }

var User = new mongoose.Schema({
     id: {type: String, validate: [validator, "Empty Error"]}
    ,passwd: {type: String, validate: [validator, "Empty Error"]}
    ,created: {type: Date, default: Date.now}
});
exports.User = db.model('User', User);


var Room = new mongoose.Schema({
    number: {type: Number, validate: [validatorn, "Empty Error"]}
    ,author: {type: String, validate: [validator, "Empty Error"]}
    ,title: {type: String, validate: [validator, "Empty Error"]}
    ,sumbnail: {type: String}
    ,summary:{type: String}
    ,created: {type: Date, default: Date.now}
    ,activeImage: {type: Number}
    ,count : {type: Number, default:0,validate:[validatorn,"Empty Error"]}
});
exports.Room = db.model('Room',Room);


var ChatLog = new mongoose.Schema({
    created : { type: Date, default: Date.now}
    ,userid : {type: String, validate: [validator, "Empty Error"]}
    ,comment : {type: String, validate: [validator, "Empty Error"]}
    ,star : {type: Number,default:0,validate:[validatorn, "Empty Error"]}
});
exports.ChatLog = function(number) {return db.model('ChatLog'+number, ChatLog);};

var Mark = new mongoose.Schema({
    created: {type: Date,default: Date.now}
    ,type:{type:String,validate:[validator,"Empty Error"]}
    ,x:{type:Number,validate:[validatorn,"Empty Error"]}
    ,y:{type:Number,validate:[validatorn,"Empty Error"]}
    ,width:{type:Number}
    ,height:{type:Number}
    ,content:{type:String}
});
exports.Mark = function(number) {return db.model('Mark'+number,Mark);};

var Image = new mongoose.Schema({
    room: {type: Number,validate: [validatorn, "Empty Error"]}
    ,title: {type: String, validate: [validator, "Empty Error"]}
    ,path: {type: String,validate: [validator, "Empty Error"]}
    ,created: {type: Date, default: Date.now}
});
exports.Image = db.model('Image',Image);
