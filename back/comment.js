const mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    theme: String,
    author: String,
    detekomentar: String,
    undercoms: String,
    text: String,
    like: String,
    dislike: String
}, { collection: "comments" });

commentSchema.pre("save", function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

module.exports = mongoose.model("comment", commentSchema);