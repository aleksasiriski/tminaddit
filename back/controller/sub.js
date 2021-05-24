const express = require("express")
const router = express()
const user = require("../model/user")
const sub = require("../model/sub")
const theme = require("../model/theme")
const comment = require("../model/comment")
const check = require("./authentication")

router.get("/subs", async (req, res) => {
    try {
        const allSubs = await sub.find()
        res.status(200).json({
            success: true,
            subs: allSubs
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/subs/:id", async (req, res) => {
    try {
        const id = req.params.id
        const specificSub = await sub.findById(id)
        res.status(200).json({
            success: true,
            sub: specificSub
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/subs/:id/themes", async (req, res) => {
    try {
        const id = req.params.id
        const specificSub = await sub.findById(id)
        res.status(200).json({
            success: true,
            name: specificSub.name,
            themes: specificSub.themes,
            description: specificSub.description
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/subs/:id/name", async (req, res) => {
    try {
        const id = req.params.id
        const specificSub = await sub.findById(id)
        res.status(200).json({
            success: true,
            name: specificSub.name
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/subs", check.isAuthenticated, async (req, res) => {
    try {
        const name = req.body.name
        const description = req.body.description
        //const icon = req.body.icon
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        const newSubBody = {
            name: name,
            description: description,
            //icon: icon,
            mainModerator: specificUser._id
        }
        const newSub = new sub(newSubBody)
        const savedSub = await newSub.save()
        specificUser.moderatedSubs.push(savedSub._id)
        specificUser.created.subs.push(savedSub._id)
        await specificUser.save()
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
router.put("/subs/:id", check.isAuthenticated, async (req, res) => {
    try {
        const subId = req.params.id
        const specificSub = await sub.findById(subId)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificSub, specificUser)) {
            sub.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
                if (err) {
                    console.log("Error during record updates: " + err)
                }
            })
            res.status(200).json({
                success: true
            })
        }    
        else {
            res.status(403).json({
                success: false
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.delete("/subs/:id", check.isAuthenticated, async (req, res) => {
    try {
        const subId = req.params.id
        const specificSub = await sub.findById(subId)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificSub, specificUser)) {
            specificSub.themes.forEach(async (themeId) => {
                const specificTheme = await theme.findById(themeId)
                specificTheme.comments.forEach(async (commentId) => {
                    const specificComment = await comment.findById(commentId)
                    specificComment.delete()
                })
                specificTheme.delete()
            })
            specificSub.delete()
            res.status(200).json({
                success: true
            })
        } else {
            res.status(403).json({
                success: false
            })
        }
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
function isPermitted(specificSub, specificUser) {
    if (specificUser.admin == true) {
        return true
    }
    const userId = user._id
    if (specificSub.mainModerator == userId) {
        return true
    } else {
        specificSub.moderators.forEach((moderator) => {
            if (moderator == userId) {
                return true
            }
        })
    }
    return false
}

module.exports = router