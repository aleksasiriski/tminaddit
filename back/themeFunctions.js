// themes
app.get("/api/themes", async (req, res) => {
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
app.get("/api/theme", async (req, res) => {
    try {
        const id = req.query.id
        const oneTheme = await theme.findById(id)
        res.status(200).json({
            success: true,
            theme: oneTheme
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.post("/api/themes", async (req, res) => {
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
app.post("/api/themesUpdate", async (req, res) => {
    try {
        phone.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
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
app.delete("/api/themes/:id", checkAuthenticated, async (req, res) => {
    try {
        const themeId = req.params.id
        const oneTheme = await theme.findById(themeId)
        const deletedTheme = await oneTheme.delete()
        res.status(200).json({
            success: true,
            phone: deletedTheme
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})