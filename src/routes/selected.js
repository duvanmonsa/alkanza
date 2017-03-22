const express = require('express')
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn()
const router = express.Router()
const firebase = require('firebase')
// logic to select images
router.get('/', ensureLoggedIn, function (req, res, next) {
  const database = firebase.database()
  let imagedata = {
    url: req.query.image
  }
  let newimage
  if (req.query.hasOwnProperty('continue')) {
    newimage = firebase.database().ref().child('images').push().key
    database.ref('user-images/' + req.user.id + '/' + newimage).update(imagedata)
    res.redirect('/selected')
    return
  }
  if (req.query.hasOwnProperty('finish')) {
    newimage = firebase.database().ref().child('images').push().key
    database.ref('user-images/' + req.user.id + '/' + newimage).update(imagedata)
    res.render('end')
    return
  }
  res.render('selected', { user: req.user })
})

module.exports = router
