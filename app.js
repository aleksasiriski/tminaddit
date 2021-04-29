if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const connectDB = require('./back/database')
const user = require('./back/user')
const phone = require('./back/phone')

connectDB()
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('./front'))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(user.createStrategy())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
app.use(methodOverride('_method'))

// index
app.get('/', (req, res) => {
    res.render('index.ejs')
})
app.get('/phone', (req, res) => {
    res.render('phone.ejs')
})
app.get('/createPhone', (req, res) => {
    res.render('createPhone.ejs')
})

// start server
const port = 3000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})