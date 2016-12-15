var mongoose = require('mongoose');

var PostEntrySchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
  	text: { type: String },
}, {
  timestamps: true
});

function date2String(date) {
  var options = {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

PostEntrySchema.methods.getCreatedAt = function() {
  return date2String(this.createdAt);
};

module.exports = mongoose.model('PostEntry', PostEntrySchema);
