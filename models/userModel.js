import conn from './../config.js';

async function createUser(userDetails) {
  try {
    const {email, username, publicKey, device} = userDetails;

    // Create a new user document in MongoDB using Mongoose
    const newUser = new conn.User({
      email,
      username,
      publicKeys: [{public_key: publicKey, device}],
    });

    // Save the user document to the database
    const savedUser = await newUser.save();
    // Optionally return the saved user data or any specific information
    return savedUser;
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(email) {
  try {
    // Find a user in MongoDB using Mongoose
    const user = await conn.User.findOne({email: email});

    // Return the user or any specific information
    return user;
  } catch (error) {
    throw error;
  }
}

async function getPublicKeyByUser(userId) {
  try {
    // Find user keys in MongoDB using Mongoose
    const user = await conn.User.findOne({_id: userId});
    let keys = [];

    user.publicKeys.forEach((userKey) => {
      keys.push(userKey.public_key);
    });

    // Return the user keys or any specific information
    return keys;
  } catch (error) {
    throw error;
  }
}

async function addPublicKeyToUser(userId, publicKey, device) {
  try {
    // Create a new user key document in MongoDB using Mongoose
    const newUserKey = new conn.UserKey({
      user_id: userId,
      device,
      public_key: publicKey,
    });

    // Save the user key document to the database
    const savedUserKey = await newUserKey.save();

    // Optionally return the saved user key data or any specific information
    return savedUserKey;
  } catch (error) {
    throw error;
  }
}

export default {
  createUser,
  getUserByEmail,
  addPublicKeyToUser,
  getPublicKeyByUser,
};
