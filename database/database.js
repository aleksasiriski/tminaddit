const mongoose = require("mongoose");

async function connectDB() {
    try {
        const url = "mongodb://localhost:27017/tminaddit";

        const connection = await mongoose.connect(url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log("Connected to database");
    } catch (err) {
        console.log(`Error: ${err.message}`);
    }
}

module.exports = connectDB;
