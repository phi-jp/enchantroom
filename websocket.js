var config = require('./config');
var port = config.SECOND_PORT;
var io = require('socket.io').listen(port);
var db = require('./model');

var log = console.log;

    //io.sockets.emit('',{});//全体
    //socket.emit('',{});// 送信元socketに返信
    //socket.on('',function(socket){});
//
// initialize rooms
//

var room = db.Room;
room.find({},'number',function(err,docs){
    if (err) {
    }
    else if (docs.length > 0){
        docs.forEach(function(doc){
            initRoom(doc.number);
        });
    }
});



var initRoom = function(roomNumber) {
    if (roomNumber === null) return false;
    //
    // TODO: counter
    //
    var counter = 0;
    var room = io.of('/'+roomNumber).on('connection', function(socket) {
        var counter = function(crement){
            var Room = require('./model').Room;
            Room.findOne({number:roomNumber},function(err,doc){
                if (err) {
                    // TODO: error handling
                }
                else {
                    Room.update({number:roomNumber},{count:doc.count+crement},{upsert:false,multi:true},function(err){
                    // TODO: socket send or interval
                    // io.sockets.emit('announce',{mode:});
                    });
                }
            });
        };
        counter(1);
        socket.broadcast.emit('join');
        socket.on('disconnect',function(){
            counter(-1);
            socket.broadcast.emit('leave');
        });
        socket.on('message',function(data){
            console.log(data);
            var dat = JSON.parse(data);
            var ChatLog = require('./model').ChatLog(roomNumber);
            var newLog = new ChatLog({userid:dat.user,comment:dat.message});
            newLog.save(function(err){
                if (err) {
                    //
                    // TODO: error handling
                    //
                    dat._id = this.emitted.complete[0]._id;
                    room.emit('message',JSON.stringify(dat));
                }
                else {
                    
                    dat._id = this.emitted.complete[0]._id;
                    room.emit('message',JSON.stringify(dat));
                }
            });
        });//! on message
        socket.on('new mark',function(data){
            var dat = JSON.parse(data);
            if (dat.type != 'click') {
                var Mark = require('./model').Mark(roomNumber);
                var mark = new Mark(dat);
                mark.save(function(err){
                    if (err) {
                        
                    }
                    else {
                        dat.id = this.emitted.complete[0]._id;
                        room.emit('new mark',JSON.stringify(dat));
                    }
                });
            }
            else {
                room.emit('new mark',JSON.stringify(dat));
            }
        });//! on new mark
        socket.on('remove mark',function(data){
            var Mark = require('./model').Mark(roomNumber);
            Mark.remove({_id:data},function(err){
                if (err) {}
                else {
                    room.emit('remove mark',data);
                }
            });
        });
        socket.on('update mark',function(data){
            var dat = JSON.parse(data);
            if (dat.type == 'text') {
                var Mark = require('./model').Mark(roomNumber);
                Mark.update({_id:dat.id},{content:dat.content},
                    {upsert:false,multi:true},function(err){
                    // TODO: handling error
                    if (err) {}
                    else {
                        room.emit('update mark',data);
                    }
                });
            }
        });//! on update mark content
        socket.on('move',function(data){
            var dat = JSON.parse(data);
            var Mark = require('./model').Mark(roomNumber);
            Mark.findOne({_id:dat.id},function(err,doc){
                // TODO: error
                if(err){
                        console.log(err);                }
                Mark.update({_id:dat.id},{x:doc.x+dat.dx,y:doc.y+dat.dy},{upsert:false,multi:true},function(err){
                    // TODO: error
                    if (err) {

                    }
                    socket.broadcast.emit('move',data);
                });
            });
        });//! on move
        socket.on('drawing',function(data){
            // TODO: save drawn
            socket.broadcast.emit('drawing',data);
        });//! on drawing
        socket.on('reset draw',function(){
            room.emit('reset draw');
        });//! on reset draw
        socket.on('image update', function(data){
            
            room.emit('image update',data);
        });//! change image
        socket.on('change image',function(data){
            // save selected image
            var dat = JSON.parse(data);
            db.Room.update({number:roomNumber},{activeImage:dat.index},{upsert:false,multi:true},function(err){
                // TODO: handling error
            });
            room.emit('change image',data);
        });
    });
    
    return true;
};//! initRoom


/*
io.of('/top').on('connection',function(socket){
    
});
*/

io.sockets.on('connection',function(socket) {
     // 全体メッセージ
    socket.on('announce',function(data){
        io.sockets.emit('announce',data);
    });
    
    socket.on('create room', function(data) {
        var dat = JSON.parse(data);
        dat.mode = 'new room';
        io.sockets.emit('announce',JSON.stringify(dat));
        initRoom(dat.room);
    });
});
