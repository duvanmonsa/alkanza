'use strict'

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const exphbs = require('express-handlebars')
const session = require('express-session')
const env = require('node-env-file')

if (process.env.NODE_ENV === 'development') {
// aqui carga el modulo y las variables
  env(`${__dirname}/../.env`)
}
// Configure Passport to use Auth0
var strategy = new Auth0Strategy({
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3001/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
  return done(null, profile)
})

passport.use(strategy)

// This can be used to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  secret: 'tomatosessionkey',
  resave: true,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

const routes = require('./routes/index')
const selected = require('./routes/selected')

app.locals.user = false
app.use(function (req, res, next) {
  app.locals.user = req.user
  next() // make sure we go to the next routes and don't stop here
})

app.use('/', routes)
app.use('/selected', selected)

app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs', layoutsDir: 'src/views/layouts/'}))
app.set('view engine', '.hbs')

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())
const port = process.env.PORT || 3002

const firebase = require('firebase')
var config = {
  apiKey: 'AIzaSyCJKWY41-iOoxEvDKeUU6sYM0sQcSlx-D8',
  authDomain: 'alkanza-dffb8.firebaseapp.com',
  databaseURL: 'https://alkanza-dffb8.firebaseio.com',
  storageBucket: 'alkanza-dffb8.appspot.com'
}
firebase.initializeApp(config)
app.listen(port)
console.log('Server started on port ' + port)
