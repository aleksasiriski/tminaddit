// includes
const { Router } = require("express")
const router = Router()
const check = require("../controller/authentication")

// subs
router.get("/subs", (req, res) => {
    res.render("../front/views/subs.ejs")
})
router.get("/sub", (req, res) => {
    res.render("../front/views/sub.ejs")
})

// export
module.exports = router