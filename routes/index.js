var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var passport = require('passport')
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'prk',
    password : 'prk',
    database : 'prk'
});
connection.connect();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'JAExpress' });
});

router.get('/register', function(req, res, next) {
    res.render('register', { title: 'JAExpress' });
});

router.post('/doRegister', function(req, res, next) {
    var username = req.body.username;
    var gender = req.body.gender;
    var password = req.body.password;
    var email = req.body.email;

    var sql = "INSERT INTO users VALUES(?,?,?,?,?)";
    var values = [null,username,gender,password,email];
    connection.query(sql,values,function (err,results) {
        //jalan ketika query selesai di lakukan
        if (err){
            console.log(err);
            throw err;
        }
        return res.redirect('/');
    });
});
var authMiddleware = function (req, res,next) {
    if(req.session.user){
        next();
    }else{
        res.redirect('/');
    }
};

router.get('/home',authMiddleware,function (req,res,next) {
    return res.render('home',{user:req.session.user});
});

router.get('/logout',function (req,res,next) {
    req.session.destroy();
    //req.session.destroy('key'); << hapus value dr key tersebut
    res.redirect('/');
});



router.post('/doLogin',function (req,res,next) {
   var credential = req.body.credential;
   var password = req.body.password;
   var sql = "SELECT * FROM users WHERE (username = ? or email = ?) and password = ?";
   var values = [credential,credential, password];
   connection.query(sql,values,function (err,results) {
       if(err){
           console.log(err);
           throw err;
       }
       if(results.length==0){
           return res.redirect('/');
       }

       req.session.user = results[0];
       return res.redirect('/home');
   });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] })); //scope untuk jadi permission agar bisa diambil emailnya

router.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), function(req, res) {
   /* return req;
    req.session.user = req.user; //simpen hasil dari API facebook ke session
    return res.redirect('/home');*/ //lgsung redirect ke halaman home ketika sudah berhasil login
    /*var sql = "SELECT * FROM users WHERE ";
    var values = [req.user.emails[0].valid];
    if(results.length==0){
        req.session.emails = req.user;
    }
    req.session.user = results[0];
    return res.redirect('/home');*/
});



module.exports = router;
