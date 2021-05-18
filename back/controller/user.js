//.env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

//includes
const { Router } = require("express")
const router = Router()
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const user = require("../model/user")
const check = require("./authentication")

//express and passport
router.use(flash())
router.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
router.use(passport.initialize())
router.use(passport.session())
passport.use(user.createStrategy())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
router.use(methodOverride("_method"))

//users
router.post("/login", check.isNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
router.post("/register", check.isNotAuthenticated, async (req, res) => {
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

        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
})
router.delete("/logout", check.isAuthenticated, (req, res) => {
    req.logOut()
    res.redirect("/login")
})
router.get("/user", check.isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.session.passport.user
    })
})
router.get("/username/:id", check.isAuthenticated, async (req, res) => {
    try {
        const userId = req.params.id
        const specificUser = await user.findById(userId)
        const username = specificUser.username
        res.status(200).json({
            success: true,
            username: username
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

//export
module.exports = router