const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.signup = async(req, resp) => {
    try{
        //fetch data from request body
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne( { email } );

        // if existing user contains a value instead of null
        if (existingUser){
            return resp.status(400).json({
                success : false,
                message : "User already exists"
            });
        }

        //secure password - in hash , 2 argz - which needs to be hash and till the number of rounds
        let hashPassword;
        try{
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch(error){
            return resp.status(500).json( {
                success: false,
                message : "Error in hashing the password."
            });
        }

        //create entry for user in db if the user is valid and not already existing
        const user = await User.create({
            name, email, password : hashPassword, role
        })

        //response message 
        return resp.status(200).json({
            success: true,
            message : "User created successfully"
        });
    }

    //even if we try to enter role other than specified in model -> error will occured
    catch(error){
        console.log(error);
        return resp.status(500).json({
            success : false,
            message : "user cannot be registerd , please try again later"
        });
    }
}


//login 

exports.login = async(req, resp) => {

    try{

        //fetch user's data form request's body
        const {email, password} = req.body;

        //check validations - here we 're using basic to check the email or password empty or not, can add many more
        if( !email || !password ){
            return resp.status(400).json({
                success : false,
                message : "User have to submit all the required details"
            })
        }

        //ckeck the email is registered or not
        let user = await User.findOne( { email } );
        //if not registered user
        if (!user) {
            return resp.status(401).json({
                status : false,
                message : "user does not exists, please sign up, then try to login"
            })
        }

        //creating payload / data to pass in jwt token -> here, email, name etc will not be the user fetched attr.
        const payLoad = {
            email : user.email,
            id : user._id,
            role : user.role
        }

        //verifying password
        if(await bcrypt.compare (password, user.password)){
            //password sahi hai
            let token = jwt.sign(
                payLoad,
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn : '2h'
                }
            );

            console.log(user);

            //Very Imp step -> attaching the token in user object and passing the user object in response to client -> why ? for middleware verification
            //converting the fetched user object into object. why ?
            user = user.toObject();
            //passing / inserting a new entry of token in that user object which we fetched not in db
            user.token = token
            //password hta diya from user object, to prevent from hacker
            user.password = undefined;

            console.log(user);

            //creating a optional parameter to pass in cookie
            const optional = {
                expires : new Date( Date.now() + 3 * 24 * 60 * 60 * 1000 ) ,
                //cookies will for http req only ; 3*24*60*60*1000 - 3 days ; 3000 - 3 sec
                httpOnly : true
            }

            //creating and passing cookie to user -> by response directly
            resp.cookie("tokenInCookie", token, optional).status(200).json({
                success: true,
                token,
                user,
                message : "user logged in successfully"
            })
            // resp.status(200).json({
            //     success: true,
            //     token,
            //     user,
            //     message : "user logged in successfully"
            // })
        }

        else {
            //password sahi nahi hai
            return resp.status(401).json({
                success : false,
                message : "Password is incorrect"
            })
        }
    }
    
    catch(error){
        console.log(error);
        return resp.status(500).json({
            success : false,
            message : "Login Failure"
        })
    }
}