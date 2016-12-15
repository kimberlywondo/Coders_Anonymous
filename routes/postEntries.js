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
    res.redirect('/');
  }
  else {
    next();
  }
}

// INDEX -- GET ALL CONFESSIONS
//*router.get('/', authenticate, function(req, res, next) {
//
//	//  var postEntries = global.currentUser.postEntries;
////  res.render('postEntries/index', { postEntries: postEntries, message: req.flash() });
//
//	*PostEntry.find({})
//		.then(function(posts) {
//		res.render('postEntries/index', {
//			postEntries: posts
//		});
//	});
//});

//INDEX -- GET ALL
router.get('/', authenticate, function(req, res, next) {
	PostEntry.find({ user: req.user })
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
  res.render('postEntries/new', { postEntry: postEntry });
});


//// SHOW
router.get('/:id', authenticate, function(req, res, next) {
  PostEntry.findById(req.params.id)
  .then(function(postEntry) {
    if (!postEntry) return next(makeError(res, 'Document not found', 404));
    res.render('postEntries/show', { postEntry: postEntry });
  }, function(err) {
    return next(err);
  });
});


//// CREATE
router.post('/', authenticate, function(req, res, next) {
  var postEntry = new PostEntry( {
	user: req.user,
    title: req.body.title,
	text: req.body.text
  });
	postEntry.save();
	res.redirect('/postEntries');//mongoose method to save an instance of a postEntry object
});


//// UPDATE  ***** USERS CANNOT UPDATE POSTS
//router.put('/:id', authenticate, function(req, res, next) {
//  Postentry.findById(req.params.id)
//  .then(function(postEntry) {
//    if (!postEntry) return next(makeError(res, 'Document not found', 404));
//    postEntry.title = req.body.title;
//    postEntry.completed = req.body.completed ? true : false;
//    postEntry.lastUpdatedAt = req.body.lastUpdatedAt;
//    return postEntry.save();
//  })
//  .then(function(saved) {
//    res.redirect('/postEntries');
//  }, function(err) {
//    return next(err);
//  });
//});


//// DELETE
router.delete('/:id', authenticate, function(req, res, next) {
  PostEntry.findByIdAndRemove(req.params.id)
  .then(function() {
    res.redirect('/postEntries');
  }, function(err) {
    return next(err);
  });
});


module.exports = router;
