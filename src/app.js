const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql2');
const myConnection = require('express-myconnection');
require('dotenv').config();

const app = express();

// Import routes
const customerRoutes = require('./routes/customer');

// Settings
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(
  myConnection(
    mysql,
    {
      host: 'localhost',
      user: 'root',
      password: process.env.PASSWORD_DB,
      port: 3306,
      database: 'practica_frank',
    },
    'single'
  )
);

// Routes
app.use('/', customerRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.listen(app.get('port'), () => {
  console.log('Server run on: http://localhost:' + process.env.PORT);
});
