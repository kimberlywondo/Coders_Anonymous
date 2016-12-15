var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');

var PostEntry = require('../models/postEntry');

//USER AUTHENTICATION
function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Coders Anonymous'});
});

// MEMBER BOARD -- GET ALL CONFESSIONS
router.get('/memberBoard', authenticate, function(req, res, next) {
	PostEntry.find({})
		.then(function(posts) {
		res.render('memberBoard.ejs', {
			postEntries: posts
		});
	});
});


// GET /signup
router.get('/signup', function(req, res, next) {
  res.render('signup.ejs', { message: req.flash() });
});

// POST /signup
router.post('/signup', function(req, res, next) {
  var signUpStrategy = passport.authenticate('local-signup', {
    successRedirect : '/postEntries',
    failureRedirect : '/signup',
    failureFlash : true
  });

  return signUpStrategy(req, res, next);
});

// GET /login
router.get('/login', function(req, res, next) {
  res.render('login.ejs', { message: req.flash() });
});

// POST /login
router.post('/login', function(req, res, next) {
  var loginProperty = passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login',
    failureFlash : true
  });

  return loginProperty(req, res, next);
});

// GET /logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});


//show all post entries
//add if statement to authenticate and show only for users
//router.get('/' function(req, res, next) {
//  // get all the todos and render the index view
//  PostEntry.find({}).sort(-createdAt)
//  .then(function(postEntries) {
//    res.render('/index', { AllPosts: postEntries } );
//  }, function(err) {
//    return next(err);
//  });
//	console.log('show all');
//});


module.exports = router;
