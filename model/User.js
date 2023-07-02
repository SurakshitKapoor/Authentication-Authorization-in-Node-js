const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( {
    name:{
        type: String,
        required: true,
        trim : true
    },
    email:{
        type: String,
        required: true,
        trim : true
    },
    password:{
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum : ['Visitor', "Student", "Admin"]
    },
} );

//ab schema se model bna kar export karenge
module.exports = mongoose.model('User', userSchema);