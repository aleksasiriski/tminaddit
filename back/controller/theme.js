const { Router } = require("express")
const router = Router()
const sub = require("../model/sub")
const theme = require("../model/theme")
const comment = require("../model/comment")
const check = require("./authentication")

router.get("/api/themes", async (req, res) => {
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
router.get("/api/themes/:id", async (req, res) => {
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
router.post("/api/themes", async (req, res) => {
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
router.put("/api/themes", async (req, res) => {
    try {
        phone.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
            if (err) {
                console.log("Error during record updates: " + err)
            }
        })
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
router.delete("/api/themes/:id", async (req, res) => {
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
function isPermitted(specificTheme, specificSub, user) {
    if (user.admin == true) {
        return true
    }
    const userId = user._id
    if  (specificTheme.author == userId) {
        return true
    }
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