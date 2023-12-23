import model from '../models/userModel.js';
import crypto from 'crypto';

async function verifyChallenge(originalChallenge, signedChallenge, publicKey) {
  try {
    console.log('Original challenge:', originalChallenge);
    console.log('Signed challenge:', signedChallenge);
    console.log('Public key:', publicKey);

    // Import the client's public key
    const importedPublicKey = await crypto.subtle.importKey(
      'spki',
      publicKey,
      {
        name: 'ECDSA',
        namedCurve: 'P-256',
      },
      true,
      ['verify']
    );

    // Verify the signed challenge with the public key
    const result = await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: {name: 'SHA-256'},
      },
      importedPublicKey,
      signedChallenge,
      originalChallenge
    );

    console.log('Result:', result);

    // Return true if the signature verification succeeds, false otherwise
    return result;
  } catch (error) {
    console.error('Error verifying the challenge:', error);
    return false;
  }
}

function generateChallenge(storage) {
  // Creates a new challenge
  var challenge = crypto.randomBytes(32).toString('hex');

  // Convert hex string to bytes
  function hexToBytes(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return bytes;
  }

  const challengeArray = hexToBytes(challenge);
  storage.challenge = challengeArray;
  return challengeArray;
}

async function registerUser(req, res) {
  const {email, username, publicKey, device} = req.body;

  if (
    email === undefined ||
    username === undefined ||
    publicKey === undefined ||
    device === undefined
  ) {
    res.status(400).json({message: 'Bad Request'});
    return;
  }

  if (email === '' || username === '' || publicKey === '' || device === '') {
    res.status(400).json({message: 'All fields are required'});
    return;
  }

  const user = await model.getUserByEmail(email);
  if (user) {
    res.status(409).json({message: 'User already exists'});
    return;
  }

  console.log(email, username, publicKey, device);

  // create a new user
  await model.createUser({email, username, publicKey, device});

  res.status(200).json({message: 'User created', success: true});
}

async function loginUser(req, res) {
  const {email, challenge} = req.body;

  if (email === undefined || challenge === undefined) {
    res.status(400).json({message: 'Bad Request'});
    return;
  }

  if (email === '') {
    res.status(400).json({message: 'Email is required'});
    return;
  }

  try {
    const user = await model.getUserByEmail(email);

    if (!user || user.length === 0) {
      res.status(404).json({message: 'User not found'});
      return;
    }

    const username = user.username;
    const user_id = user._id.toString();
    const publicKeys = await model.getPublicKeyByUser(user_id);

    const originalChallengeValues = Object.values(req.session.challenge);
    const signedChallengeValues = Object.values(challenge);

    // Create Uint8Array from the extracted values
    const originalChallengeBytes = new Uint8Array(originalChallengeValues);
    const signedChallengeBytes = new Uint8Array(signedChallengeValues);

    // Then use these Uint8Arrays in your verifyChallenge function
    publicKeys.forEach(async (publicKey) => {
      const publicKeyBytes = new Uint8Array(publicKey);

      const assertion = await verifyChallenge(
        originalChallengeBytes,
        signedChallengeBytes,
        publicKeyBytes
      );

      if (assertion === true) {
        // Set user session
        req.session.user = {user_id, email, username};
        req.session.connected = true;
        res.status(200).json({message: 'User logged in', success: true});
        return;
      } else {
        res.status(401).json({message: 'Invalid challenge signature'});
        return;
      }
    });
  } catch (error) {
    // Handle any errors that occurred during the process
    console.error('Error:', error);
    res.status(500).json({message: 'Internal Server Error'});
  }
}

function registerNewDevice(req, res) {
  // ...
}

export default {generateChallenge, registerUser, loginUser, registerNewDevice};
