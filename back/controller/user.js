//includes
const express = require("express")
const router = express()
const passport = require("passport")
const methodOverride = require("method-override")
const user = require("../model/user")
const check = require("./authentication")

//express and passport
passport.use(user.createStrategy())
passport.serializeUser(user.serializeUser())
passport.deserializeUser(user.deserializeUser())
router.use(methodOverride("_method"))

//users
router.post("/login", check.isNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
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
router.delete("/logout", check.isAuthenticated, async (req, res) => {
    try {
        req.logOut()
        res.redirect("/login")
    } catch {
        res.redirect("/")
    }
})
router.get("/user", check.isAuthenticated, async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.session.passport.user
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
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