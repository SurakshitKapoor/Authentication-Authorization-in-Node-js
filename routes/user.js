const express = require('express');
const router = express.Router();
const User = require("../model/User");

const { login, signup } = require('../controllers/Auth');
const { auth, isStudent, isAdmin} = require('../middlewares/auth');

router.post('/login', login);
router.post('/signup', signup);

//Protected routes
//phle /student ke liye request aygi, then auth wala middleware call hoga to check the user is valid or not, then isStudent middleware will call to check the role is student or not

router.get('/test', auth, (req, resp) => {
    resp.json({
        success: true,
        message : "welcome to the protected route of tests"
    });
});

//sirf student hi access kar payega -> visitor ya admin nahi
router.get('/student', auth, isStudent, (req, resp) => {
    resp.json({
        success: true,
        message : "welcome to the protected route of students"
    });
});

//can only access by a admin
router.get('/admin', auth, isAdmin, (req, resp) => {
    resp.json({
        success: true,
        message : "welcome to the protected route of admin"
    });
});


//getting user id and details using token -> by authn and authz
router.get("/getUser", auth, async (req, resp) => {

    try {
      const id = req.user.id;
      console.log("User Id: ", id);
      const user = await User.findById({ _id: id });
      console.log("User : ", user);

      resp.status(200).json({
        success: true,
        message: "User and his Id is found",
        user: user,
      });
    } catch (error) {
      console.log(error);
      resp.status(403).json({
        success: false,
        message: "User id is not found",
      });
    }

})


module.exports = router;
