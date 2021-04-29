// phones
app.get("/api/phones", async (req, res) => {
    try {
        const allPhones = await phone.find()
        res.status(200).json({
            success: true,
            phones: allPhones
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.get("/api/phone", async (req, res) => {
    try {
        const id = req.query.id
        const specificPhone = await phone.findById(id)
        res.status(200).json({
            success: true,
            phone: specificPhone
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.post("/api/phones", async (req, res) => {
    try {
        const newPhone = new phone(req.body)
        await newPhone.save()
        res.status(200).json({
            success: true,
            phone: newPhone
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
app.post("/api/phonesUpdate", async (req, res) => {
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
app.delete("/api/phones/:id", checkAuthenticated, async (req, res) => {
    try {
        const phoneId = req.params.id
        const specificPhone = await phone.findById(phoneId)
        const deletedPhone = await specificPhone.delete()
        res.status(200).json({
            success: true,
            phone: deletedPhone
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})