const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserModel = new Schema({
  id: ObjectId,
  created_at: Date,
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, unique: true }, // `email` must be unique 
  password: { type: String, required: true, minlength: [8, 'Password must be at least 8 chars long']},
  Posts: {
    type: Schema.Types.ObjectId, ref: 'Post',
  }  
});


UserModel.pre(
  'save',
  async function (next) {
      const user = this;
      const hash = await bcrypt.hash(this.password, 10);

      this.password = hash;
      next();
  }
);

// You will also need to make sure that the user trying to log in has the correct credentials. Add the following new method:
UserModel.methods.isValidPassword = async function(password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
}

module.exports = mongoose.model('Users', UserModel);
