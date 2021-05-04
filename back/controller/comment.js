app.get("/api/comments", async (req, res) => {
    try {
        const allcomments = await comment.find()
        res.status(200).json({
            success: true,
            comments: allcomments
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.get("/api/comments/:id", async (req, res) => {
    try {
        const id = req.params.id
        const specificcomment = await comment.findById(id)
        res.status(200).json({
            success: true,
            comment: specificcomment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.post("/api/comments", async (req, res) => {
    try {
        const newcomment = new comment(req.body)
        await newcomment.save()
        res.status(200).json({
            success: true,
            comment: newcomment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.put("/api/comments", async (req, res) => {
    try {
        comment.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
            if (err) {
                console.log('Error during record updates: ' + err)
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
app.delete("/api/comments/:id", checkAuthenticated, async (req, res) => {
    try {
        const commentId = req.params.id
        const specificcomment = await comment.findById(commentId)
        const deletedcomment = await specificcomment.delete()
        res.status(200).json({
            success: true,
            comment: deletedcomment
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})