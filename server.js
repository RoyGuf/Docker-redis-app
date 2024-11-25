const express = require('express');
const cors    = require('cors');
const port    = 3000;

const { getAllUsers, 
        getUserById, 
        addUser, 
        setupDatabase } = require('./routs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

// routs
// get user by id
app.get('/', getAllUsers);
// get user by id
app.get('/user/:id', getUserById);
// add user 
app.post('/', addUser);
// setup database table if not exists
app.get('/setup',  setupDatabase);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});