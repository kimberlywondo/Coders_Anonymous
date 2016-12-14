var express = require('express');
var router = express.Router();

var PostEntry = require('../models/postEntry');

function makeError(res, message, status) {
  res.statusCode = status;
  var error = new Error(message);
  error.status = status;
  return error;
}

//USER AUTHENTICATION
function authenticate(req, res, next) {
  if(!req.isAuthenticated()) {
    req.flash('error', 'Please signup or login.');
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX
router.get('/', authenticate, function(req, res, next) {
//  var postEntries = global.currentUser.postEntries;
//  res.render('postEntries/index', { postEntries: postEntries, message: req.flash() });
	PostEntry.find({})
		.then(function(posts) {
		res.render('postEntries/index', {
			postEntries: posts
		});
	});
});

////NEW
router.get('/new', authenticate, function(req, res, next) {
  var postEntry= {
    title: '',
    text: '',
  };
  res.render('postEntries/new', { postEntry: postEntry, message: req.flash() });
});
//
//// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  var postEntry = currentUser.postEntries.id(req.params.id);
  if (!postEntry) return next(makeError(res, 'Document not found', 404));
  res.render('postEntries/show', { postEntry: postEntry, message: req.flash() } );
});
//
//// CREATE
router.post('/', authenticate, function(req, res, next) {
  var postEntry = {
    title: req.body.title,
	text: req.body.text,
  };
//
currentUser.postEntries.push(postEntry);
  currentUser.save()
  .then(function() {
    res.redirect('/postEntries');
  }, function(err) {
    return next(err);
  });
});
//
//// UPDATE
//router.put('/:id', authenticate, function(req, res, next) {
//  var postEntry = currentUser.postEntries.id(req.params.id);
//  if (!postEntry) return next(makeError(res, 'Document not found', 404));
//  else {
//    postEntry.title = req.body.title;
//    postEntry.completed = req.body.completed ? true : false;
//    currentUser.save()
//    .then(function(saved) {
//      res.redirect('/postEntries');
//    }, function(err) {
//      return next(err);
//    });
//  }
//});
//
//// DELETE
router.delete('/:id', authenticate, function(req, res, next) {
  var postEntry = currentUser.postEntries.id(req.params.id);
  if (!postEntry) return next(makeError(res, 'Document not found', 404));
  var index = currentUser.postEntries.indexOf(postEntry);
  currentUser.postEntries.splice(index, 1);
  currentUser.save()
  .then(function(saved) {
    res.redirect('/postEntries');
  }, function(err) {
    return next(err);
  });
});

//show all post entries
//router.get('/', authenticate, function(req, res, next) {
//  // get all the todos and render the index view
//  PostEntry.find({}).sort(-createdAt)
//  .then(function(postEntries) {
//    res.render('postEntries/index', { AllPosts: postEntries } );
//  }, function(err) {
//    return next(err);
//  });
//});


module.exports = router;



module.exports = router;
