const express = require("express")
const app = express()

const connectDB = require("./back/database/database")
const checkAuthenticated = require("./back/controller/checkAuthenticated")
const checkNotAuthenticated = require("./back/controller/checkNotAuthenticated")

connectDB()
app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./front/static"))

// views
app.get("/", checkAuthenticated, (req, res) => {
    res.render("../front/views/index.ejs")
})
app.get("/dms", checkAuthenticated, (req, res) => {
    res.render("../front/views/dms.ejs")
})

// users
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.render("../front/views/login.ejs")
})
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.render("../front/views/register.ejs")
})
const userRoute = require("./back/controller/user")
app.use("/api", userRoute)

// comments
const commentRoute = require("./back/controller/comment")
app.use("/api", commentRoute)

// subs
const subRoute = require("./back/controller/sub")
app.use("/api", subRoute)

// themes
const themeRoute = require("./back/controller/theme")
app.use("/api", themeRoute)

// startup
const port = 3000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})