if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const connectDB = require('./back/database/database')
const user = require('./back/users/user')

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
app.get('/phone', checkAuthenticated, (req, res) => {
    res.render('phone.ejs')
})
app.get('/createPhone', checkAuthenticated, (req, res) => {
    res.render('createPhone.ejs')
})

// users
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
app.post('/api/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})
app.post('/api/register', checkNotAuthenticated, async (req, res) => {
    try {
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password

        const User = new user({
            username: username,
            email: email
        })
        await User.setPassword(password)
        await User.save()

        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/api/logout', checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect('/login')
})
app.get('/api/user', checkAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        username: req.session.passport.user
    })
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

// start server
const port = 3000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})