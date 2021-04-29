var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: Date,
    updatedAt: Date
}, { collection: "users" });

userSchema.pre("save", function (next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("user", userSchema);