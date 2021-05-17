// includes
const { Router } = require("express")
const router = Router()
const check = require("../controller/authentication")

// themes
router.get("/themes", (req, res) => {
    res.render("../front/views/themes.ejs")
})
router.get("/theme", (req, res) => {
    res.render("../front/views/theme.ejs")
})

// export
module.exports = router