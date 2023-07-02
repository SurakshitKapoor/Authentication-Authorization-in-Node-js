const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get("/", (req, resp) => {
    console.log(`we're at port ${PORT}`);
    resp.send(` Hello! we are at index file of our live express server at port : ${PORT} `);
})

//databse call
require('./config/database').connect();

//route create and mount

const user = require('./routes/user');
app.use('/api/v1', user); 

//cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser()); // adding the cookiepraer middleware in express server

//listening or activating
app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})