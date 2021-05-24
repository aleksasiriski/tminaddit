const express = require("express")
const router = express()
const user = require("../model/user")
const sub = require("../model/sub")
const theme = require("../model/theme")
const comment = require("../model/comment")
const check = require("./authentication")

router.get("/themes", async (req, res) => {
    try {
        const allThemes = await theme.find()
        res.status(200).json({
            success: true,
            themes: allThemes
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/themes/:id", async (req, res) => {
    try {
        const id = req.params.id
        const specificTheme = await theme.findById(id)
        res.status(200).json({
            success: true,
            theme: specificTheme
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/themes/:id/small", check.isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id
        const specificTheme= await theme.findById(id)

        res.status(200).json({
            success: true,
            theme: {
                _id: specificTheme._id,
                sub: specificTheme.sub,
                title: specificTheme.title,
                author: specificTheme.author,
                content: specificTheme.content,
                upvotes: specificTheme.upvotes,
                time: specificTheme.createdAt
            }
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/themes", check.isAuthenticated, async (req, res) => {
    try {
        const specificSubId = req.body.sub
        const specificSub = await sub.findById(specificSubId)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        const title = req.body.title
        const category = req.body.category
        const content = req.body.content
        const newThemeBody = {
            sub: specificSubId,
            author: specificUser._id,
            title: title,
            category: category,
            content: content,
            upvotes: 0,
            downvotes: 0
        }
        const newTheme = new theme(newThemeBody)
        const savedTheme = await newTheme.save()
        specificSub.themes.push(savedTheme._id)
        await specificSub.save()
        specificUser.created.themes.push(savedTheme._id)
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
router.put("/themes", check.isAuthenticated, async (req, res) => {
    try {
        const themeId = req.params.id
        const specificTheme = await theme.findById(themeId)
        const specificSub = await sub.findById(specificTheme.sub)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificTheme, specificSub, specificUser)) {
        theme.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
            if (err) {
                console.log("Error during record updates: " + err)
            }
        })
        res.status(200).json({
            success: true
        })}
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.put("/themes/:id/upvote", check.isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id 
        const specificTheme = await theme.findById(id)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        let found = false
        let reload = false
        specificUser.upvotes.themes.forEach((themeId) => {
            if (!found && themeId == specificTheme._id) {
                found = true
            }
        })
        if (!found) {
            specificTheme.upvotes++
            specificUser.upvotes.themes.push(specificTheme._id)
            let newDownvotes = []
            specificUser.downvotes.themes.forEach((themeId) => {
                if (!found && themeId == specificTheme._id) {
                    found = true
                } else {
                    newDownvotes.push(themeId)
                }
            })
            if (found) {
                specificTheme.downvotes--
                specificUser.downvotes.themes = newDownvotes
            }
            specificTheme.save()
            specificUser.save()
            reload = true
        }
        res.status(200).json({
            success: true,
            reload: reload
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.put("/themes/:id/downvote", check.isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id 
        const specificTheme = await theme.findById(id)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        let found = false
        let reload = false
        specificUser.downvotes.themes.forEach((themeId) => {
            if (!found && themeId == specificTheme._id) {
                found = true
            }
        })
        if (!found) {
            specificTheme.downvotes++
            specificUser.downvotes.themes.push(specificTheme._id)
            let newUpvotes = []
            specificUser.upvotes.themes.forEach((themeId) => {
                if (!found && themeId == specificTheme._id) {
                    found = true
                } else {
                    newUpvotes.push(themeId)
                }
            })
            if (found) {
                specificTheme.upvotes--
                specificUser.upvotes.themes = newUpvotes
            }
            specificTheme.save()
            specificUser.save()
            reload = true
        }
        res.status(200).json({
            success: true,
            reload: reload
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.delete("/themes/:id", check.isAuthenticated, async (req, res) => {
    try {
        const themeId = req.params.id
        const specificTheme = await theme.findById(themeId)
        const specificSub = await sub.findById(specificTheme.sub)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificTheme, specificSub, specificUser)) {
            specificTheme.comments.forEach(async (commentId) => {
                const specificComment = await comment.findById(commentId)
                specificComment.delete()
            })
            specificTheme.delete()
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
function isPermitted(specificTheme, specificSub, specificUser) {
    if (specificUser.admin == true) {
        return true
    }
    const userId = user._id
    if  (specificTheme.author == userId) {
        return true
    }
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