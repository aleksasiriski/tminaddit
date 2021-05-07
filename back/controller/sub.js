const { Router } = require("express")
const router = Router()
const sub = require("../model/sub")
const checkAuthenticated = require("./checkAuthenticated")

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
router.post("/subs", async (req, res) => {
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
        const specificSub = await sub.findById(subId)
        const deletedSub = await specificSub.delete()
        res.status(200).json({
            success: true,
            sub: deletedSub
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: err.message
        })
    }
})

module.exports = router