var mongoose = require("mongoose")

var phoneSchema = new mongoose.Schema({
    model: {
        type: String,
        required: true,
        unique: true
    },
    manufacturer: String,
    price: String,
    image: String,
    dimensions: {
        length: String,
        width: String,
        height: String
    },
    display: String,
    os: String,
    memory: String,
    camera: String,
    battery: String,
    ratings: String,
    nratings: String,
    youtube: String,
    review: String,
    experiences: [{
        name: String,
        content: String,
        likes: String,
        dislikes: String,
        comments: [{
            name: String,
            content: String
        }]
    }],
    createdAt: Date,
    updatedAt: Date
}, { collection: "phones" })

phoneSchema.pre("save", function (next) {
    var currentDate = new Date()
    this.updatedAt = currentDate
    if (!this.createdAt)
        this.createdAt = currentDate
    next()
})

module.exports = mongoose.model("phone", phoneSchema);