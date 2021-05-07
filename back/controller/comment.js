const { Router } = require("express")
const router = Router()
const comment = require("../model/comment")
const checkAuthenticated = require("./checkAuthenticated")

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
router.post("/comments", async (req, res) => {
    try {
        const newComment = new comment(req.body)
        await newComment.save()
        res.status(200).json({
            success: true,
            comment: newComment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.put("/comments", async (req, res) => {
    try {
        comment.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
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
router.delete("/comments/:id", checkAuthenticated, async (req, res) => {
    try {
        const commentId = req.params.id
        const specificComment = await comment.findById(commentId)
        const deletedComment = await specificComment.delete()
        res.status(200).json({
            success: true,
            comment: deletedComment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router