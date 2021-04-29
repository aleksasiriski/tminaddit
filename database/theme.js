var mongoose = require("mongoose");

var themeSchema = new mongoose.Schema({
    sub:{
        type:String,
        required: true
    },
    title:{
        type: String,
        required:true,
        unique:true
    },
    category:String,
    content:String,
    votes:{
        upvotes:String,
        downvotes:String
    },
    comments:[String],
    author:String,
    createdAt: Date,
    updatedAt: Date
}, { collection: "themes" });

themeSchema.pre("save", function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

module.exports = mongoose.model("theme", themeSchema);