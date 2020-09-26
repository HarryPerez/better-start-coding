const { schema: Schema, mongoose } = require('../db');

const schema = new Schema({
  name: String,
  surname: String,
  email: { type: String, match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
  password: String,
  role: String,
  section: String,
  active: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('User', schema);
