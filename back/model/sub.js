const mongoose = require("mongoose")

var subSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    icon: String,
    mainmoderator: String,
    moderators: [String],
    upvotes: Number,
    downvotes: Number

}, { collection: "subs" })

subSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next();
})

module.exports = mongoose.model("sub", subSchema)