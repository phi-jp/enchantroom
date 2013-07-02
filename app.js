
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , db = require('./routes/db')
  , sign = require('./routes/sign')
  , createroom = require('./routes/createroom')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({secret: "mikan oishii"}));
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


/*
 * Rooting
 */
app.get('/', routes.index);
app.get('/mypage',routes.mypage);
app.get('/room',routes.room);

/* account sign */
app.get('/new_account', sign.newAccount);
app.post('/available_account', sign.availableAccount);
app.post('/create_account',sign.create);
app.get('/login',sign.login);
app.post('/check_account',sign.check);
app.get('/logout',sign.logout);

/* create room */
app.get('/new_room', createroom.create);
app.post('/create_room', createroom.init);


/* access database */
app.get('/roomlist',db.roomlist);
app.get('/roomCount',db.roomCount);
app.get('/users_room', db.usersroom);
app.get('/activeImage',db.activeImage);// required query has room number
app.get('/marks',db.marks);// required query has room number
app.get('/chatlog',db.chatLog);// required query has room number
app.post('/addStar',db.addStar);
app.get('/starLog',db.starLog);
app.get('/images', db.images);// required query has room number
app.post('/upload', db.upload);


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);
//var socket = require('socket.io').listen(app);
io.sockets.on('connection', function(socket) {

});





