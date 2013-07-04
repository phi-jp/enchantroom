
/*
 * GET home page.
 */
 
var wshost = require('../config').WSHOST;

exports.index = function(req, res){
  // res.render('index', {});
  // return ;

  if (req.session.flg) {
    res.render('index', { title: 'enchantRoom', authed: req.session.flg, username: req.session.userid,wshost:wshost});
  }
  else {
    res.render('index', { title: 'enchantRoom', authed: req.session.flg,wshost:wshost });
  }

};


exports.mypage = function(req, res){
  if (req.session.flg) {
      res.render('mypage', { title: 'enchantRoom - mypage', authed: req.session.flg, username: req.session.userid,wshost:wshost});
  } else {
      res.redirect('/');
  }
};

exports.room = function(req, res){
    var Room = require('../model').Room;
    Room.findOne({number: req.query.number},function(err,doc){
        //
        // TODO: 作成されていないページの場合の処理
        //
        if (err) {
            res.redirect('/');
        }
        else if (doc === null) {
            res.status(404);
            res.send();
            //res.writeHeader(404);
        }
        else {
            res.render('room', {
                title: doc.title,
                roomNumber: req.query.number,
                authed: req.session.flg,
                username: req.session.userid,
                author: doc.author,
                wshost:wshost
                //sumbnail: doc.sumbnail ? : default sumbnail
                });
        }
    });
};
