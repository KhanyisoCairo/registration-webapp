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

//home
app.get('/', async function (req, res) {
  let addingRegistration =  await registrationFactory.getRegistration();
  res.render('index', {regis: addingRegistration });
});
//home displaying registration number
app.get('/reg_numbers', async function (req, res) {
      let addingRegistration =  await registrationFactory.getRegistration();
      
  console.log({regis: addingRegistration},"line 48")
      res.render('index', {regis: addingRegistration });
});
//this is to post the registration
app.post('/reg_numbers', async function (req, res) {
  console.log(req.body.firstname,"line 51");

  await registrationFactory.registration(req.body.firstname)
  res.redirect("/reg_numbers");
});
app.post('/filter', async function (req, res) {
  // await registrationFactory.registration(req.body.RegNumber1)
let filter  = await registrationFactory.filter(req.body.RegNumber1);
res.render('index', {regis: filter });
  //  res.redirect("/");
});

// app.post('/', async function (req, res) {
//   await greetFactory.resetDb();

//   res.redirect('/');
// })

const PORT = process.env.PORT || 3006;
app.listen(PORT, function () {
  console.log("App started at port:", PORT)
});