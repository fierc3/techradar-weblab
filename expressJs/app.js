var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
const bcrypt = require('bcrypt');
const saltRounds = 10; // for salt rounds check here: https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt

var app = express();
app.use(cors())

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

const logHistoryChange = (tech_id, next) => {
  console.log("next", next)
  var stmt = db.prepare("SELECT name, category, ring FROM tech WHERE tech_id = ?");
  stmt.get([tech_id], (error, row) => {
    console.log("Adding History Entry")
    var stmt = db.prepare(`
        INSERT INTO history ( text, tech_id, user_id) 
        VALUES (?, ?, ?)`);
    const log = `${next.text_date}: User with ID ${next.user_id}, update tech: 
    ${row.name}=>${next.name}
    ${row.ring}=>${next.ring}
    ${row.category}=>${next.category}
    `
    stmt.run([log, tech_id, next.user_id])
  })
}

//tech radar API
/*
* Reading and Editing of Tech Entries
*/
app.put('/api/tech', (req, res) => {
  console.log("PUT request received for specific tech", req.body);
  try {
    const {
      tech_id,
      name,
      category,
      ring,
      description,
      description_decision,
      user_id,
      public } = req.body;
    if (!name || !category || !user_id || !description) {
      return res.send('ERROR: Name, Category, UserId  and Description have ot have values');
    }
    if (tech_id) {
      const save_date = new Date();
      const text_date = save_date.toLocaleString("en-US");
      logHistoryChange(tech_id, { name, category, ring, text_date, user_id })
      console.log("Update tech: ", tech_id, name);
      var stmt = db.prepare(`
      UPDATE tech SET 
        name = ?, 
        category = ?, 
        ring = ?, 
        description = ?, 
        description_decision = ?,
        public = ?,
        save_date = '${save_date.toISOString()}', 
        user_id=? WHERE tech_id = ?`);
      stmt.run([name, category, ring, description, description_decision,public, user_id, tech_id], (
        error) => {
        if (error) {
          res.send("ERROR " + error);
        } else {
          stmt.finalize((error) => {
            if (error) {
              res.send('ERROR:' + error.message)
            } else {
              res.send("success")
            }
          });
        }
      });
    } else {
      console.log("Inserting tech: ", name);
      var stmt = db.prepare(`
      INSERT INTO tech ( name, category, ring, description, description_decision,public,save_date,user_id) 
      VALUES (?, ?, ?, ?,?,?,?,?)`);
      stmt.run([name, category, ring, description, description_decision,public, new Date().toISOString(), user_id],
        (error) => {
          if (error) {
            res.send("ERROR " + error);
          } else {
            stmt.finalize((error) => {
              if (error) {
                res.send('ERROR:' + error.message)
              } else {
                res.send("success")
              }
            });
          }
        });
    }

  } catch (error) {
    console.log("Failed updating tech", error)
  }

});

app.get('/api/tech', (req, res) => {
  db.all(`SELECT *
             FROM tech`, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("err" + err.message)
    }
    console.log(rows);
    res.status(200).json({
      "message": "success",
      "data": rows
    })
  });
});

/*
* Get History For Tech
*/
app.get('/api/history/:techId', (req, res) => {
  console.log(req.params);
  const tech_id = req.params.techId
  db.all(`SELECT *
             FROM history WHERE tech_id = ?`, [tech_id], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send("err" + err.message)
    }
    console.log(rows);
    res.status(200).json({
      "message": "success",
      "data": rows
    })
  });
});

/*
* User Management: Registration, Login, etc.
*/

const hash = async (input) => {
  const result = bcrypt.hash(input, saltRounds);
  return result;
}

app.post('/api/login', async function (req, res) {
  try {
    const { email, password } = req.body;
    console.log("User attempting to login with: ", email, password);
    if (!email || !password) {
      return res.send('ERROR: Email AND Password has to have values');
    }

    var stmt = db.prepare("SELECT password, user_id, display, role FROM user WHERE email = ?");
    stmt.get([email], (
      error, row) => {
      console.log("CHecking values: ", password, row)
      if (error) {
        res.send("ERROR " + error);
        return false;
      } else {
        stmt.finalize((error) => {
          if (error) {
            res.send('ERROR:' + error.message)
            return false;
          } else {
            bcrypt.compare(password, row.password, function (err, same) {
              if (err) {
                res.send('ERROR:' + err)
                return false;
              } else {
                if (same === true) {
                  res.status(200).json(JSON.stringify({ user_id: row.user_id, display: row.display, role: row.role }))
                  return;
                }
                res.status(200).send(same)
                return same;
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log("Failed registration", error)
  }
});


app.post('/api/register', async function (req, res) {
  try {
    const { display, role, email, password } = req.body;
    console.log("User attempting to register with: ", email, password);
    if (!email || !password || !display || !password || !role) {
      return res.status(500).send('ERROR: Values missing');
    }
    const hashPassword = await hash(password);
    console.log(hashPassword);
    var stmt = db.prepare(`INSERT INTO user ( display, role, email, password) 
    VALUES (?, ?, ?, ?)`);
    stmt.run([display, role, email, hashPassword], (error) => {
      if (error) {
        console.log(error)
        return res.status(500).send("ERROR " + error);
      } else {
        res.status(200).send("success")
      }
    })

  } catch (error) {
    console.log("Failed login", error)
  }
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler + cors
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log('error', err);
});

module.exports = app;
