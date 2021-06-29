const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');

//set up connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodeSqlJS3',
});

//connect
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});
const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.send('Express veikia normaliai');
});

app.get('/createdb', (req, res) => {
  const sql = 'CREATE DATABASE nodeSqlJS3';
  db.query(sql, (err, result) => {
    if (err) throw err;
    //no errors
    console.log(result);
    res.send('duomenu baze sukurta');
  });
});

//create table
app.get('/table/create', (req, res) => {
  const sql = `
  CREATE TABLE posts(
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      body TEXT NOT NULL,
      created_at TIMESTAMP on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
  )`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'lentele sukurta' });
  });
});

//add new post
app.get('/new/post', (req, res) => {
  const newPost = { title: 'Third post title', body: 'Third sql body sent into table' };
  const sql = 'INSERT INTO posts SET ?';
  db.query(sql, newPost, (err, result) => {
    if (err) throw err.stack;
    console.log(result);
    res.json({ result, msg: 'post created' });
  });
});

//get all posts

app.get('/allposts', (req, res) => {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

app.get('/post/:id', (req, res) => {
  const sql = `SELECT * FROM posts WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

app.listen('3000', console.log('server running on port 3000'));
