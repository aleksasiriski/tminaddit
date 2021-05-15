const express = require("express")
const app = express()

const connectDB = require("./back/database/database")

connectDB()
app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./front/static"))

// views
app.get("/", (req, res) => {
    res.render("../front/views/index.ejs")
})
app.get("/sub", (req, res) => {
    res.render("../front/views/sub.ejs")
})
app.get("/profile_page", (req, res) => {
    res.render("../front/views/profile_page.ejs")
})

// users
const userRoute = require("./back/controller/user")
app.use("/", userRoute)

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