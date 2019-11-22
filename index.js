const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const RegistrationFactory = require('./regNumbers');
const pg = require("pg");
var app = express();

const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:kingdelaan@localhost:5432/registration';

const pool = new Pool({
  connectionString
});

const registrationFactory = RegistrationFactory(pool);

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
// initialise session middleware - flash-express depends on it
app.use(session({
  secret: "<this my secret string that has the session >",
  resave: false,
  saveUninitialized: true
}));
// initialise the flash middleware
app.use(flash())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

 //Routes
//home 
app.get('/', async function (req, res) {
  
  res.render('index', {
    regis: await registrationFactory.registration()
  });
});
//home displaying registration number
app.post('/reg_numbers', async function (req, res) {
      let addingRegistration =  await registrationFactory.getRegistration();
      res.render('index', {registration: addingRegistration });
  console.log({regis: addingRegistration},"line 48")
});
//this is to post the registration 
app.post('/reg_numbers', async function (req, res) {
  console.log(req.body);
  
  await registrationFactory.registration(req.body.firstname)
  res.redirect("/");
});
app.post('/filter', async function (req, res) {
  await registrationFactory.registration(req.body.firstname)
// let filter  = await registrationFactory.filter();
// res.render('index', {regis: filter });
  // res.redirect("/");
});

const PORT = process.env.PORT || 3007;
app.listen(PORT, function () {
  console.log("App started at port:", PORT)
});