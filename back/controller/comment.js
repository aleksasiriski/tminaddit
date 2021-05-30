const express = require("express")
const router = express()
const user = require("../model/user")
const sub = require("../model/sub")
const theme = require("../model/theme")
const comment = require("../model/comment")
const check = require("./authentication")

router.get("/comments", async (req, res) => {
    try {
        const allComments = await comment.find()
        res.status(200).json({
            success: true,
            comments: allComments
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.get("/comments/:id", async (req, res) => {
    try {
        const id = req.params.id
        const specificComment = await comment.findById(id)
        res.status(200).json({
            success: true,
            comment: specificComment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/comments", check.isAuthenticated, async (req, res) => {
    try {
        const specificThemeId = req.body.theme
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        const parentCommentId = req.body.parent
        const content = req.body.content
        const newCommentBody = {
            theme: specificThemeId,
            author: specificUser._id,
            parent: parentCommentId,
            content: content,
            upvotes: 1,
            downvotes: 0
        }
        const newComment = new comment(newCommentBody)
        const savedComment = await newComment.save()
        const specificTheme = await theme.findById(specificThemeId)
        specificTheme.commentNumber++
        if (parentCommentId == specificThemeId) {
            specificTheme.comments.push(savedComment._id)
        } else {
            const specificComment = await comment.findById(parentCommentId)
            specificComment.children.push(savedComment._id)
            await specificComment.save()
        }
        specificUser.created.comments.push(savedComment._id)
        specificUser.upvotes.comments.push(savedComment._id)
        await specificTheme.save()
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
router.put("/comments", check.isAuthenticated, async (req, res) => {
    try {
        const commentId = req.params.id
        const specificComment = await comment.findById(commentId)
        const specificTheme = await theme.findById(specificComment.theme)
        const specificSub = await sub.findById(specificTheme.sub)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificComment, specificSub, specificUser)) {
        comment.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
            if (err) {
                console.log("Error during record updates: " + err)
            }
        })}
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
router.put("/comments/:id/upvote", check.isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id 
        const specificComment = await theme.findById(id)
        const specificUser = req.session.passport.user
        let found = false
        specificUser.upvotes.comments.forEach((commentId) => {
            if (!found && commentId == specificComment._id) {
                found = true
            }
        })
        if (!found) {
            specificComment.upvotes++
            specificUser.upvotes.comments.push(specificComment._id)
            specificUser.downvotes.comments.forEach((commentId) => {
                if (!found && commentId == specificComment._id) {
                    commentId.delete()
                    found = true
                }
            })
            if (found) {
                specificComment.downvotes--
            }
            specificComment.save()
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
router.put("/comments/:id/downvote", check.isAuthenticated, async (req, res) => {
    try {
        const id = req.params.id 
        const specificComment = await theme.findById(id)
        const specificUser = req.session.passport.user
        let found = false
        specificUser.downvotes.comments.forEach((commentId) => {
            if (!found && commentId == specificComment._id) {
                found = true
            }
        })
        if (!found) {
            specificComment.downvotes++
            specificUser.downvotes.comments.push(specificComment._id)
            specificUser.upvotes.comments.forEach((commentId) => {
                if (!found && commentId == specificComment._id) {
                    commentId.delete()
                    found = true
                }
            })
            if (found) {
                specificComment.upvotes--
            }
            specificComment.save()
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
router.delete("/comments/:id", check.isAuthenticated, async (req, res) => {
    try {
        const commentId = req.params.id
        const specificComment = await comment.findById(commentId)
        const specificTheme = await theme.findById(specificComment.theme)
        const specificSub = await sub.findById(specificTheme.sub)
        const specificUser = await user.findOne({"username": `${req.session.passport.user}`})
        if (isPermitted(specificComment, specificSub, specificUser)) {
                specificComment.author = "[deleted]"
                specificComment.content = "[deleted]"
                await specificComment.save()
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
function isPermitted(specificComment, specificSub, specificUser) {
    if (specificUser.admin == true) {
        return true
    }
    const userId = user._id
    if  (specificComment.author == userId) {
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