var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt   = require('bcrypt-nodejs');
var PostEntry = require('./models/postEntry');
var User = require('./models/user');

mongoose.connect('mongodb://localhost/Coders_Anonymous');

function quit() {
    mongoose.disconnect();
    console.log('\nQuitting!');
}

function handleError(err) {
    console.error('ERROR:', err);
    quit();
    return err;
}

function getUsers() {
    var john = new User({
        local: {
            email: 'jd@me.co',
            password: bcrypt.hashSync('test',  bcrypt.genSaltSync(8))
        }
    });
    var kim = new User({
        local: {
            email: 'kw@me.co',
            password: bcrypt.hashSync('test2', bcrypt.genSaltSync(8))
        }
    });
    return [john, kim];
}


PostEntry.remove({})
    .then(function() {
        return User.remove({});
    })
    .then(function() {
        return User.create(getUsers());
    })
    .then(function(users) {
        console.log('Saved users:', users);
        var firstThing = new PostEntry({
            user: users[0],
            title: 'this is a title',
            text: 'this is text',
        });
		var secondThing = new PostEntry({
            user: users[1],
            title: 'this is a second title',
            text: 'this is second text',
        });
        return PostEntry.create([firstThing, secondThing]);
    })
    .then(function(savedPosts) {
        console.log('Just saved', savedPosts.length, 'posts.');
        return PostEntry.find({});
    })
    .then(function(allPosts) {
        console.log('Printing all posts:');
        allPosts.forEach(function(post) {
            console.log(post.title);
        });
        return PostEntry.find({});
    })
    .then(function(allPosts) {
        console.log('Printing all posts:');
        allPosts.forEach(function(post) {
            console.log(post);
        });
        quit();
    })
    .catch(handleError);
