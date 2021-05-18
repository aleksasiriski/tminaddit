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
        const specificChat = await chat.findById(chatId)

        const username = req.session.passport.user
        const specificUser = await user.findOne({"username": `${username}`})

        let found = false
        specificChat.participants.forEach((participant) => {
            if (!found && participant == specificUser._id) {
                found = true
            }
        })
        if (found) {
            res.status(200).json({
                success: true,
                chat: specificChat
            })
        } else {
            res.status(403).json({
                success: true
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/chats/:id/name", check.isAuthenticated, async (req, res) => {
    try {
        const chatId = req.params.id
        const specificChat = await chat.findById(chatId)

        const username = req.session.passport.user
        const specificUser = await user.findOne({"username": `${username}`})

        let found = false
        specificChat.participants.forEach((participant) => {
            if (!found && participant == specificUser._id) {
                found = true
            }
        })
        if (found) {
            res.status(200).json({
                success: true,
                chatName: specificChat.name
            })
        } else {
            res.status(403).json({
                success: true
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/chats", check.isAuthenticated, async (req, res) => {
    try {
        const chatName = req.body.name

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const senderId = sender._id

        const recipientUsername = req.body.recipient
        const recipient = await user.findOne({"username": `${recipientUsername}`})
        const recipientId = recipient._id

        const newChatBody = {
            name: chatName,
            participants: [senderId, recipientId]
        }

        const newChat = new chat(newChatBody)
        await newChat.save()

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
router.post("/chats/:id/recipients", check.isAuthenticated, async (req, res) => {
    try {
        const chatId = req.params.id
        const chat = await chat.findById(chatId)

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const senderId = sender._id

        let found = false
        chat.participants.forEach((participant) => {
            if (!found && participant == senderId) {
                found = true
            }
        })
        if (found) {
            const recipientUsername = req.body.recipient
            const recipient = await user.findOne({"username": `${recipientUsername}`})
            const recipientId = recipient._id
            chat.participants.push(recipientId)
            await chat.save()
            res.status(200).json({
                success: true
            })
        } else {
            res.status(403).json({
                success: true
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/chats/:id/messages", check.isAuthenticated, async (req, res) => {
    try {
        const chatId = req.params.id
        const chat = await chat.findById(chatId)

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const senderId = sender._id

        let found = false
        chat.participants.forEach((participant) => {
            if (!found && participant == senderId) {
                found = true
            }
        })
        if (found) {
            const content = req.body.message
            const message = {
                sender: senderId,
                content: content,
                sentAt: new Date()
            }
            chat.messages.push(message)
            await chat.save()
            res.status(200).json({
                success: true
            })
        } else {
            res.status(403).json({
                success: true
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.put("/chats/:id/messages/:messageId", check.isAuthenticated, async (req, res) => {
    try {
        const chatId = req.params.id
        const chat = await chat.findById(chatId)

        const senderUsername = req.session.passport.user
        const sender = await user.findOne({"username": `${senderUsername}`})
        const senderId = sender._id

        let found = false
        chat.participants.forEach((participant) => {
            if (!found && participant == senderId) {
                found = true
            }
        })
        if (found) {
            const messageId = req.params.messageId
            const message = await chat.messages.findById(messageId)
            if (senderId == message.sender) {
                message.content = req.body.message
                message.edited = true
                message.sentAt = new Date()
                await chat.save()
                res.status(200).json({
                    success: true
                })
            } else {
                res.status(403).json({
                    success: true
                })
            }
        } else {
            res.status(403).json({
                success: true
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

//export
module.exports = router