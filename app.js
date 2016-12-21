var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');

var index = require('./routes/index');
var postEntries = require('./routes/postEntries');
var users = require('./routes/users');

var app = express();


// Connect to database
if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect('mongodb://localhost/Coders_Anonymous');
}
mongoose.connection.on('error', function (err) {
	console.error('MongoDB connection error: ' + err);
	process.exit(-1);
});
mongoose.connection.once('open', function () {
	console.log("yassss honeyyyy Mongoose has connected to MongoDB!");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(session({
	secret: '?',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./config/passport/passport')(passport);

// This middleware will allow us to use the currentUser in our views and routes.
app.use(function (req, res, next) {
	global.currentUser = req.user;
	next();
});


app.use('/', index);
app.use('/users', users);
app.use('/postEntries', postEntries);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

console.log('Yass honeyyy!');

module.exports = app;

// TODO: