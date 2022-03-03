var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//init react
// serve the react app files
console.log("initing react files")
app.use(express.static(`${__dirname}/react/build`));
app.get('/', (req, res) => res.sendFile(path.resolve('react', 'build', 'index.html')));


// DB
const sqlite3 = require('sqlite3').verbose();

// open a database connection
let db = new sqlite3.Database('./techradar.db');

//tech radar API
/*
* Reading and Editing of Tech Entries
*/
app.put('/api/tech/:techId', (req, res) => {
  console.log("PUT request received for specific tech");
  return res.send(
    `PUT HTTP method on tech/${req.params.techId} resource`,
  );
});

app.get('/api/tech/:techId', (req, res) => {
  console.log("GET request received for specific tech");
  return res.send(
    `PUT HTTP method on tech/${req.params.techId} resource`,
  );
});

app.get('/api/tech', (req, res) => {
  console.log("GET request received for specific tech");
  return res.send(
    `GET HTTP method on tech resource`,
  );
});

/*
* User Management: Registration, Login, etc.
*/
app.post('/api/register', function(req, res) {
  console.log(req.body);
  const { email, password } = req.body;
  console.log("User attempting to register with: ", email, password);
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler + cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('error',err);
});

module.exports = app;
