const mongoose = require("mongoose")

const subSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    description: String,
    icon: String,
    mainModerator: String,
    moderators: [String],
    themes: [String],
    createdAt: Date,
    updatedAt: Date
}, { collection: "subs" })

subSchema.pre("save", function (next) {
    const currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next();
})

module.exports = mongoose.model("sub", subSchema)