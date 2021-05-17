var mongoose = require("mongoose")

var themeSchema = new mongoose.Schema({
    sub: String,
    title: String,
    category: String,
    content: String,
    upvotes: Number,
    downvotes: Number,
    comments: [String],
    author: String,
    createdAt: Date,
    updatedAt: Date
}, { collection: "themes" })

themeSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

module.exports = mongoose.model("theme", themeSchema)