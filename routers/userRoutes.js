const express = require("express");
const { Pool } = require('pg');

const {  userController} = require("../controller/userController");
// const { signinValidate, signupValidate } = require("../middleware/middlewares");
const router = express.Router(); 
// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "crud",
//     password: "1234",
//     port: 5432,
// });
// //user signup 
// router.route("/signup").post(, signUp);

// //user signin
// router.route("/signin").post(signinValidate, signIn);

// router.route("/getTutorials").patch(userController.getTutorials);
// router.route("/createTutorial").post(userController.createTutorial);
// router.route("/updateTutorial").put(userController.updateTutorial);
// router.route("/deleteTutorial").delete(userController.deleteTutorial);
router.post('/user', userController.createUser);
router.post('/verify',userController.verifyUser);

router.put('/user', userController.updateUser);
// router.put('/user',userController.updateUser);


// router.post('/user', async (req, res) => {
   
//   });
  

module.exports = router;