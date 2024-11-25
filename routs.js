const pool              = require('./db');
const { getOrSetCache } = require('./redis');

async function getAllUsers(req, res){
  try {
    const users = await getOrSetCache('users', async () => {
      console.log('Getting all users from database...');
      try {
        const data = await pool.query('SELECT * FROM users');
        return data.rows;
      } catch (error) {
        throw error;
      }
    }, 60); // cache for 60 seconds
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('Error getting users');
  }
}

async function getUserById(req, res){
  const userId = req.params.id;
  try {
    const user = await getOrSetCache(`user?${userId}`, async () => {
      console.log(`Getting user by ID from database...`);
      try {
        const data = await pool.query('SELECT * FROM users WHERE id=$1 ', [userId]);
        return data.rows;
      } catch (error) {
        throw error;
      }
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Error getting user');
  } 
  
}

async function addUser(req, res){
  const {name, location} = req.body;
  try {
    console.log('Adding user to the database...');
    await pool.query('INSERT INTO users (name, location) VALUES ($1, $2)', [name, location]);
    res.status(200).send({message: "Successfully added user"});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error adding user');
  }
}

async function setupDatabase(req, res){
  try {
    console.log('Creating table...');
    await pool.query('CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL)');
    res.status(200).send({message: "Successfully created users table"});
  } catch (error) {
    console.log(error);
    res.status(500).send('Error setting up database');
  }
}


module.exports = { getAllUsers, getUserById, addUser, setupDatabase };