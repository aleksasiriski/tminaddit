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
app.get("/", (req, res) => {
    res.render("../front/views/index.ejs")
})
app.get("/themes", checkAuthenticated, (req, res) => {
    res.render("../front/views/themes.ejs")
})
app.get("/posts", checkAuthenticated, (req, res) => {
    res.render("../front/views/posts.ejs")
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

// dms
const dmRoute = require("./back/controller/dm")
app.use("/api", dmRoute)

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