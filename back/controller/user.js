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

//dms
router.get("/dms", check.isAuthenticated, async (req, res) => {
    try {
        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const dms = sender.dmsIds
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
router.get("/dms/:id", check.isAuthenticated, async (req, res) => {
    try {
        const recipientId = req.params.id

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})

        let specificDm = "NULL"
        let foundDm = false

        sender.dms.forEach((dm) => {
            if ( dm.id == recipientId ) {
                specificDm = dm
                foundDm = true
                return
            }
        })

        if (foundDm) {
            res.status(200).json({
                success: true,
                dm: specificDm
            })
        } else {
            res.status(404).json({
                success: true,
                dm: specificDm
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/dms/:id", check.isAuthenticated, async (req, res) => {
    try {
        let recipientId = req.params.id
        let recipient
        if (recipientId == "noid") {
            recipient = await user.findOne({"username": `${req.body.username}`})
            recipientId = recipient._id
        } else {
            recipient = await user.findById(recipientId)
        }

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const senderId = sender._id

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
            const senderDm = {
                id: recipientId,
                messages: message
            }
            const recipientDm = {
                id: senderId,
                messages: message
            }
            sender.dmsIds.push(recipientId)
            sender.dms.push(senderDm)
            recipient.dmsIds.push(senderId)
            recipient.dms.push(recipientDm)
        }

        sender.save()
        recipient.save()


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

//export
module.exports = router