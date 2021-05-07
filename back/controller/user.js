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

router.get("/dms", checkAuthenticated, async (req, res) => {
    try {
        const userId = req.session.passport.user.data._id
        const specificUser = await user.findById(userId)
        const dms = specificUser.dmsIds
        res.status(200).json({
            success: true,
            dms: dms
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/dms/:id", checkAuthenticated, async (req, res) => {
    try {
        const recipientId = req.params.id

        const senderId = req.session.passport.user.data._id
        const sender = await user.findById(senderId)

        let specificDm

        sender.dms.forEach((dm) => {
            if ( dm.id == recipientId ) {
                specificDm = dm
                return
            }
        })

        res.status(200).json({
            success: true,
            dm: specificDm
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/dms/:id", checkAuthenticated, async (req, res) => {
    try {
        const recipientId = req.params.id
        const recipient = await user.findById(recipientId)

        const senderId = req.session.passport.user.data._id
        const sender = await user.findById(senderId)

        const content = req.body.content
        const message = {
            id: senderId,
            content: content,
            sentAt: new Date()
        }

        let foundDm = false
        sender.dms.forEach((dm) => {
            if ( dm.id == recipientId ) {
                dm.messages.push(message)
                foundDm = true
                return
            }
        })
        if (foundDm) {
            recipient.dms.forEach((dm) => {
                if ( dm.id == senderId ) {
                    dm.messages.push(message)
                    return
                }
            })
        } else {
            const senderDmId = {
                id: recipientId
            }
            const senderDm = {
                id: recipientId,
                message: message
            }
            const recipientDmId = {
                id: senderId
            }
            const recipientDm = {
                id: senderId,
                message: message
            }
            sender.dmsIds.push(senderDmId)
            sender.dms.push(senderDm)
            recipient.dmsIds.push(recipientDmId)
            recipient.dms.push(recipientDm)
        }

        res.status(200).json({
            success: true
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router