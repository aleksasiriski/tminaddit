const { Router } = require("express")
const router = Router()
const sub = require("../model/user")
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
router.post("/themes", check.isAuthenticated, async (req, res) => {
    try {
        const newTheme= new theme(req.body)
        await newTheme.save()
        res.status(200).json({
            success: true,
            phone: newTheme
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
        const themeId=req.params.id
        specificTheme=await theme.findById(themeId)
        specificSub=await sub.findById(specificTheme.sub)
        if (isPermitted(specificTheme, specificSub, req.session.passport.user)) {
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
        const specificUser = req.session.passport.user
        let found = false
        specificUser.upvotes.themes.forEach((themeId) => {
            if (!found && themeId == specificTheme._id) {
                found = true
            }
        })
        if (!found) {
            specificTheme.upvotes++
            specificUser.upvotes.themes.push(specificTheme._id)
            specificUser.downvotes.themes.forEach((themeId) => {
                if (!found && themeId == specificTheme._id) {
                    themeId.delete()
                    found = true
                }
            })
            if (found) {
                specificTheme.downvotes--
            }
            specificTheme.save()
            specificUser.save()
        }
        res.status(200).json({
            success: true,
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
        const specificUser = req.session.passport.user
        let found = false
        specificUser.downvotes.themes.forEach((themeId) => {
            if (!found && themeId == specificTheme._id) {
                found = true
            }
        })
        if (!found) {
            specificTheme.downvotes++
            specificUser.downvotes.themes.push(specificTheme._id)
            specificUser.upvotes.themes.forEach((themeId) => {
                if (!found && themeId == specificTheme._id) {
                    themeId.delete()
                    found = true
                }
            })
            if (found) {
                specificTheme.upvotes--
            }
            specificTheme.save()
            specificUser.save()
        }
        res.status(200).json({
            success: true,
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
        if (isPermitted(specificTheme, specificSub, req.session.passport.user)) {
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
function isPermitted(specificTheme, specificSub, username) {
    const specificUser = await user.findOne({"username": `${username}`})
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