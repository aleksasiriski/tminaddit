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
    moderators: [String]
}, { collection: "subs" })

subSchema.pre("save", function (next) {
    var currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next();
})

module.exports = mongoose.model("sub", phoneSchema)