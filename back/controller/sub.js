const { Router } = require("express")
const router = Router()
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
router.post("/subs", check.isAuthenticated, async (req, res) => {
    try {
        const newSub = new sub(req.body)
        await newSub.save()
        res.status(200).json({
            success: true,
            sub: newSub
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
        if (isPermitted(specificSub, req.session.passport.user)) {
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
        if (isPermitted(specificSub, req.session.passport.user)) {
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
function isPermitted(specificSub, user) {
    if (user.admin == true) {
        return true
    }
    const userId = user._id
    if (specificSub.mainmoderator == userId) {
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