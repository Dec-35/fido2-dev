//mariadb config
import mongoose from 'mongoose';

const mongoDB =
  'mongodb+srv://decleggal:D75fQbiY7v6FHyAU@cluster0.ksh2zlk.mongodb.net/fido';

const UserKeySchema = new mongoose.Schema({
  user_id: String,
  publicKey: String,
  device: String,
});
const UserKey = mongoose.model('UserKey', UserKeySchema);

const UserSchema = new mongoose.Schema({
  email: String,
  username: String,
  publicKeys: [{public_key: Array, device: String}],
});

const User = mongoose.model('User', UserSchema);

mongoose
  .connect(mongoDB)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

export default {User, UserKey};
