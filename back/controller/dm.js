const { Router } = require("express")
const router = Router()
const dm = require("../model/dm")
const checkAuthenticated = require("../controller/checkAuthenticated")

router.get("/user", checkAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        username: req.session.passport.user
    })
})

module.exports = router