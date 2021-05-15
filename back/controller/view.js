//includes
const { Router } = require("express")
const router = Router()
const check = require("./authentication")

//views
router.get("/", (req, res) => {
    res.render("../front/views/index.ejs")
})

//user
router.get("/login", check.isNotAuthenticated, (req, res) => {
    res.render("../front/views/login.ejs")
})
router.get("/register", check.isNotAuthenticated, (req, res) => {
    res.render("../front/views/register.ejs")
})
router.get("/dms", check.isAuthenticated, (req, res) => {
    res.render("../front/views/dms.ejs")
})
router.get("/dm", check.isAuthenticated, (req, res) => {
    res.render("../front/views/dm.ejs")
})
router.get("/profile_page", (req, res) => {
    res.render("../front/views/profile_page.ejs")
})

//sub
router.get("/sub", (req, res) => {
    res.render("../front/views/sub.ejs")
})

//export
module.exports = router