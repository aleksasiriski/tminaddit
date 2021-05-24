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
router.get("/username/:id", check.isAuthenticated, async (req, res) => {
    try {
        const userId = req.params.id
        if (userId == "self") {
            res.status(200).json({
                success: true,
                username: req.session.passport.user
            })
        } else {
            const specificUser = await user.findById(userId)
            res.status(200).json({
                success: true,
                username: specificUser.username
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/userId/:username", check.isAuthenticated, async (req, res) => {
    try {
        const username = req.params.username
        if (username == "self") {
            const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
            res.status(200).json({
                success: true,
                userId: specificUser._id
            })
        } else {
            const specificUser = await user.findOne({"username": `${username}`})
            res.status(200).json({
                success: true,
                userId: specificUser._id
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/user/subs", check.isAuthenticated, async (req, res) => {
    try {
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        res.status(200).json({
            success: true,
            subs: specificUser.followedSubs
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