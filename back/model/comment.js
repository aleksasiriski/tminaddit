const mongoose = require("mongoose")

var commentSchema = new mongoose.Schema({
    theme: String,
    author: String,
    parentComment: String,
    undercoms: String,
    content: String,
    upvotes: Number,
    downvotes: Number,
    createdAt: Date,
    updatedAt: Date
}, { collection: "comments" })

commentSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

module.exports = mongoose.model("comment", commentSchema)