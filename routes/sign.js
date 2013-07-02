var wshost = require('../config').WSHOST;

exports.newAccount = function(req,res) {
    res.render('newAccount',{title:"アカウント作成",authed:false, message:"",wshost:wshost});
};

exports.availableAccount = function(req,res) {
    var User = require('../model').User;
    User.findOne({id: req.body.id}, function(err,docs){
        if (err || docs !== null) {
            res.send(false);
        }
        else {
            res.send(true);
        }
    });
};

exports.create = function(req,res) {
    var User = require('../model').User;
    User.findOne({id: req.body.id}, function(err,docs){
        if (err || (docs !== null) ) {
            req.session.flg = false;
            res.render('new_account',{title:"アカウント作成",authed:false,message:"既に使われているアカウントです。",wshost:wshost});
        }
        else {
            var newUser = new User({id: req.body.id, passwd: req.body.passwd});
	    newUser.save(function(err){
                if (err) {
                    //console.log(err);
                    res.render('new_account',{title:'login',message:'アカウント作成に失敗しました', authed: false,wshost:wshost});
                } else {
                    req.session.flg = true;
                    req.session.userid = req.body.id;
                    res.redirect('/');
                }
            });
	}
    });
};


exports.login = function(req,res) {
    res.render('login2',{title:'login',message:'アカウント名とパスワードを入力してください', authed: false, referer:req.header('Referer'),wshost:wshost});
};

exports.check = function(req,res){
    var User = require('../model').User;
    User.findOne({id: req.body.id}, function(err, docs){
        if (docs !== null && docs.passwd === req.body.passwd) {
            req.session.flg = true;
            req.session.userid = req.body.id;
            res.redirect(req.body.referer);
        }
        else {
            res.render('login',{title:'login', message:'ログインに失敗しました。アカウント名とパスワードが正しいか確認してください。', authed: false,referer:req.body.referer,wshost:wshost});
        }
    });
};

exports.logout = function(req,res) {
    req.session.destroy();
    res.redirect('back');
};
