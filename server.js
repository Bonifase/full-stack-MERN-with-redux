const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();


//connect to mongoDB
const db = mongoose.connect('mongodb://localhost/developerAPI', { useNewUrlParser: true }).then(() => console.log("Database is connected succesfully!!")).catch(() => console.log("Database connection failed."));

const port = process.env.PORT || 5000;

// setup bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('<h1>Hello developer</h1>'));

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(port, () => console.log(`Server running on port ${port}`));