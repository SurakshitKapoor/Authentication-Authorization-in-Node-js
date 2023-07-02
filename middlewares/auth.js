const jwt = require('jsonwebtoken');
require('dotenv').config();

//auth middleware - for checking the authencity of user by jwt token
exports.auth = (req, resp, next) => {
    try{
        //for single obj descrtuturing, don't use {}
        // const token = req.body.token || req.cookies.token || req.header('Authorization').replace("Bearer ", "") ;
        const token = req.body.token;

        console.log("body:-" , req.body.token);
        // console.log("cookie :-", req.cookies.token);
        // console.log("header", req.header("Authorization"));

        //token aaya bhi hai kya? expire toh nahi ho gaya?
        if(!token){
            return resp.status(401).json({
                success: false,
                message: "token is missing"
            })
        }

        //here, token comes and then, verifying the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            console.log(decode);
            // intentionally , insert decode token in user object, decode -> from jwt-> have -> payload-> have role object-> works for AuthZ
            req.user = decode;

        }
        catch(error){
            console.log(error);
            return resp.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }
        
        next();
    }
    
    catch(error){
        console.log(error);
        resp.status(401).json({
            success: false,
            message : "something went wrong in verifying the token"
        })
    }
}

// isStudent and isAdmin middlewares are used to check the role of user and giving the permissions to the routes if their role staisfied
// both middlewares - isStudent and isAdmin are for AuthZ using jwt token
exports.isStudent = (req, resp, next) => {
    try{
        if(req.user.role != 'Student'){
            return resp.status(401).json({
                success: false,
                message : "this is a protected route for student"
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return resp.status(500).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}

exports.isAdmin = (req, resp, next) => {
    try{
        if(req.user.role != 'Admin'){
            return resp.status(401).json({
                success: false,
                message : "this is a protected route for Admin"
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return resp.status(500).json({
            success: false,
            message: "user role cannot be verified"
        })
    }
}