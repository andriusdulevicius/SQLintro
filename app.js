const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql');

//set up connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
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
  const sql = 'CREATE TABLE nodeSql';
  db.query(sql, (err, result) => {
    if (err) throw err;
    //no errors
    console.log(result);
  });
});

app.listen('3000', console.log('server running on port 3000'));
