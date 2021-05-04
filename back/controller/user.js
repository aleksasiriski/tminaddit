if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const { Router } = require("express")
const router = Router()
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const user = require("../model/user")
const checkAuthenticated = require("../controller/checkAuthenticated")
const checkNotAuthenticated = require("../controller/checkNotAuthenticated")

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

router.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
router.post("/register", checkNotAuthenticated, async (req, res) => {
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
router.delete("/logout", checkAuthenticated, (req, res) => {
    req.logOut()
    res.redirect("/login")
})
router.get("/user", checkAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        username: req.session.passport.user
    })
})

module.exports = router