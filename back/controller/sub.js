const { Router } = require("express")
const router = Router()
const sub = require("../model/sub")
const checkAuthenticated = require("../controller/checkAuthenticated")

router.get("/subs", async (req, res) => {
    try {
        const allsubs = await sub.find()
        res.status(200).json({
            success: true,
            subs: allsubs
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
        const specificsub = await sub.findById(id)
        res.status(200).json({
            success: true,
            sub: specificsub
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.post("/subs", async (req, res) => {
    try {
        const newsub = new sub(req.body)
        await newsub.save()
        res.status(200).json({
            success: true,
            sub: newsub
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})
router.put("/subs", async (req, res) => {
    try {
        sub.findByIdAndUpdate(req.body._id, req.body, (err, doc) => {
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
router.delete("/subs/:id", checkAuthenticated, async (req, res) => {
    try {
        const subId = req.params.id
        const specificsub = await sub.findById(subId)
        const deletedsub = await specificsub.delete()
        res.status(200).json({
            success: true,
            sub: deletedsub
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router