import model from '../models/userModel.js';
import crypto from 'crypto';

function generateAssertion(storage, challenge, publicKey) {
  /*
   * @param {Object} storage - session storage
   * @param {string} challenge - privatly encrypted challenge sent by the user
   * @param {string} publicKey - public key of the user (from the database)
   * @returns {Boolean} - assertion status
   */
  // check if the challenge can be verified using the public key
  // return the assertion if the verification is successful
  // return false if the verification fails
  try {
    const verify = crypto.createVerify('sha256');
    verify.update(challenge);

    // Verify the challenge signature using the user's public key
    const isVerified = verify.verify(publicKey, signature, 'hex');
    return isVerified;
  } catch (error) {
    console.error('Error occurred during challenge verification:', error);
    return false;
  }
}

function generateChallenge(storage) {
  // Creates a new challenge
  var challenge = crypto.randomBytes(32).toString('hex');
  storage.challenge = challenge;
  return challenge;
}

async function registerUser(req, res) {
  const {email, username, publicKey, device} = req.body;

  const user = await model.getUserByEmail(email);
  if (user) {
    res.status(409).json({message: 'User already exists'});
    return;
  }
  console.log(email, username, publicKey, device);

  // create a new user
  model.createUser({email, username, publicKey, device});
}

async function loginUser(req, res) {
  const {email, challenge} = req.body;

  const user = await model.getUserByEmail(email);
  if (!user) {
    res.status(404).json({message: 'User not found'});
    return;
  }

  const {id} = user;

  const {publicKey} = await model.getPublicKeyByUser(id);

  const assertion = generateAssertion(req.session, challenge, publicKey);

  if (!assertion) {
    res.status(404).json({message: 'User not found'});
    return;
  } else {
    res.status(200).json({message: 'User logged in'});
    //set user session
    req.session.user = {id, email};
  }
}

function registerNewDevice(req, res) {
  // ...
}

export default {generateChallenge, registerUser, loginUser, registerNewDevice};
