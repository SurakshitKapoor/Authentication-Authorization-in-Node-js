const mongoose = require("mongoose");
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGO_DB, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(() => console.log("db connected successfully"))
    .catch((error) => {
        console.log("db connection issues");
        console.log(error);
        //ki kuch fata tha, isliye bahar aa rahe hain
        process.exit(1);
    });
}