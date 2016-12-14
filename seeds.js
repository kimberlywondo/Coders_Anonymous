var mongoose = require('mongoose');
var PostEntry = require('./models/postEntry');

mongoose.connect('mongodb://localhost/postEntries');

// our script will not exit until we have disconnected from the db.
function quit() {
  mongoose.disconnect();
  console.log('\nQuitting!');
}

// a simple error handler
function handleError(err) {
  console.log('ERROR:', err);
  quit();
  return err;
}

console.log('removing old todos...');
PostEntry.remove({})
.then(function() {
  console.log('old todos removed');
  console.log('creating some new todos...');
  var groceries  = new PostEntry({ title: 'groceries',    completed: false });
  var feedTheCat = new PostEntry({ title: 'feed the cat', completed: true  });
  return PostEntry.create([groceries, feedTheCat]);
})
.then(function(savedTodos) {
  console.log('Just saved', savedTodos.length, 'todos.');
  return PostEntry.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  return PostEntry.findOne({title: 'groceries'});
})
.then(function(groceries) {
  groceries.completed = true;
  return groceries.save();
})
.then(function(groceries) {
  console.log('updated groceries:', groceries);
  return groceries.remove();
})
.then(function(deleted) {
  return PostEntry.find({});
})
.then(function(allTodos) {
  console.log('Printing all todos:');
  allTodos.forEach(function(todo) {
    console.log(todo);
  });
  quit();
});
