import pool from './../config.js';

async function createUser(userDetails) {
  const {email, username, publicKey, device} = userDetails;
  const query = `INSERT INTO user (email, username) VALUES ('${email}', '${username}')`;

  pool
    .query(query, (err, result) => {
      if (err) throw err;
      console.log(result);
    })
    .then((result) => {
      const userId = result.insertId;
      addPublicKeyToUser(userId, publicKey, device);
    });
}

async function getUserByEmail(email) {
  console.log(email);
  const query = `SELECT * FROM user WHERE email = '${email}'`;

  pool
    .query(query, (err, result) => {
      if (err) throw err;
      console.log(result);
      return result;
    })
    .then((res) => {
      console.log(res);
      return res;
    });
}

async function getPublicKeyByUser(userId) {
  const query = `SELECT * FROM user_keys WHERE user_id = '${userId}'`;

  pool.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
    return result;
  });
}

function addPublicKeyToUser(userId, publicKey, device) {
  // add public FIDO key to user
  publicKey = JSON.stringify(publicKey);
  const query = `INSERT INTO user_keys (user_id, device, public_key) VALUES ('${userId}', '${device}', '${publicKey}')`;

  pool.query(query, (err, result) => {
    if (err) throw err;
    console.log(result);
  });
}

export default {createUser, getUserByEmail, addPublicKeyToUser};
