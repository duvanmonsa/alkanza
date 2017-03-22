const express = require('express')
const passport = require('passport')
const router = express.Router()
const firebase = require('firebase')

const env = {
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback'
}


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index')
})
// Render the login template
router.get('/login',
  function (req, res) {
    res.render('login', { env: process.env })
  })

// Perform session logout and redirect to homepage
router.get('/logout', function (req, res) {
  req.logout()
  res.redirect('/')
})

// Perform the final stage of authentication and redirect to '/user'
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function (req, res) {
    var database = firebase.database()
    database.ref('users/' + req.user.id).set({
      id: req.user.id,
      username: req.user.displayName,
      profile_picture: req.user.picture
    })
    res.redirect(req.session.returnTo || '/selected')
  })

module.exports = router
