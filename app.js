const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');
const path = require('path');

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
app.use(express.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
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
app.post('/newpost', (req, res) => {
  console.log(req.body);

  // const newPost = { title: 'Third post title', body: 'Third sql body sent into table' };
  const sql = 'INSERT INTO posts SET ?';
  db.query(sql, req.body, (err, result) => {
    if (err) throw err.stack;
    console.log(result);
    res.redirect('/post');
    // res.json({ result, msg: 'post created' });
  });
});

//get all posts

app.get('/post', (req, res) => {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

app.get('/post/:id', (req, res) => {
  const sql = `SELECT * FROM posts WHERE id = ${db.escape(req.params.id)}`; // apsaugo nuo hakeriu,  tiesiogiai paduodant (sql injection)
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

app.get('/post/:id/update', (req, res) => {
  //is vartotojo formos grizta atnaujinta title
  const newTitle = 'Oba naaa updatinau!';
  const sql = `UPDATE posts SET title = ${db.escape(newTitle)} WHERE id = ${db.escape(req.params.id)}`; // apsaugo nuo hakeriu,  tiesiogiai paduodant (sql injection)
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/allposts');
  });
});

//siaip su get niekad nedeletinam , cia tik del sql operaciju naudojam get requesta , del paprastumo
app.get('/post/:id/delete', (req, res) => {
  //is vartotojo formos grizta atnaujinta title
  const sql = `DELETE FROM posts WHERE id = ${db.escape(req.params.id)}`; // apsaugo nuo hakeriu,  tiesiogiai paduodant (sql injection)
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.redirect('/post');
  });
});

//uzduotis sukurti authors lentele

//create authors table
app.get('/authors/table/create', (req, res) => {
  const sql = `
  CREATE TABLE authors(
    au_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      name VARCHAR(25) NOT NULL,
      age INT(2) NOT NULL,
      sex VARCHAR(10) NOT NULL,
      post_id INT  NOT NULL,
      PRIMARY KEY (au_id)
  )`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json({ result, msg: 'autoriu lentele sukurta' });
  });
});

//get all authors

app.get('/authors', (req, res) => {
  const sql = 'SELECT * FROM authors';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});
//get all young authors age <30

app.get('/authors/young', (req, res) => {
  const sql = 'SELECT * FROM authors WHERE age < 30';
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//get all female authors

app.get('/authors/male', (req, res) => {
  const sql = `SELECT * FROM authors WHERE sex = 'male'`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

//add new author
app.post('/authors/addnew', (req, res) => {
  console.log(req.body);

  // const newAuthor = { name: 'Sigis', age: 35, sex: 'male', post_id: 123 };
  const sql = 'INSERT INTO authors SET ?';
  db.query(sql, req.body, (err, result) => {
    if (err) throw err.stack;
    console.log(result);
    res.redirect('/');
    // res.json({ result, msg: 'post created' });
  });
});

app.get('/author/:id', (req, res) => {
  const sql = `SELECT * FROM authors WHERE au_id = ${db.escape(req.params.id)}`; // apsaugo nuo hakeriu,  tiesiogiai paduodant (sql injection)
  db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.json(result);
  });
});

app.listen('3000', console.log('server running on port 3000'));

//dvieju lenteliu sujungimui :

// SELECT posts.title, authors.name, authors.age
// FROM posts
// INNER JOIN authors
// ON posts.id = authors.post_id;
