//.env
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// includes
const express = require("express")
const session = require("express-session")
const passport = require("passport")
const app = express()

// database
const connectDB = require("./back/database/database")
connectDB()

// express
app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static("./front/static"))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// users
const userViewRoute = require("./back/views/user")
app.use("/", userViewRoute)
const userRoute = require("./back/controller/user")
app.use("/api", userRoute)

// chats
const chatViewRoute = require("./back/views/chat")
app.use("/", chatViewRoute)
const chatRoute = require("./back/controller/chat")
app.use("/api", chatRoute)

// subs
const subViewRoute = require("./back/views/sub")
app.use("/", subViewRoute)
const subRoute = require("./back/controller/sub")
app.use("/api", subRoute)

// themes
const themeViewRoute = require("./back/views/theme")
app.use("/", themeViewRoute)
const themeRoute = require("./back/controller/theme")
app.use("/api", themeRoute)

// comments
const commentRoute = require("./back/controller/comment")
app.use("/api", commentRoute)

// startup
const port = 3000
app.listen(port, () => {
    console.log("Listening on port: " + port)
})