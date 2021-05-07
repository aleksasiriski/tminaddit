var mongoose = require("mongoose")

var dmSchema = new mongoose.Schema({
    participants: [{
        type: String,
        required: true,
        unique: true
    }],
    messages: [{
        sender: String,
        content: String,
        sentAt: Date
    }],
    createdAt: Date
}, { collection: "dms" })

dmSchema.pre("save", function (next) {
    const currentDate = new Date()
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

module.exports = mongoose.model("dm", dmSchema)