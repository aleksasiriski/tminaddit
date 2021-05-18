//includes
const { Router } = require("express")
const router = Router()
const user = require("../model/user")
const check = require("./authentication")

//chats
router.get("/chats", check.isAuthenticated, async (req, res) => {
    try {
        const username = req.session.passport.user
        const specificUser = await user.findOne({"username": `${username}`})
        res.status(200).json({
            success: true,
            chats: specificUser.chats
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/chats/:id", check.isAuthenticated, async (req, res) => {
    try {
        const chatId = req.params.id

        const username = req.session.passport.user
        const specificUser = await user.findOne({"username": `${username}`})

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
router.post("/chats/:id", check.isAuthenticated, async (req, res) => {
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