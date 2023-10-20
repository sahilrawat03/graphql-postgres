const express = require("express");
const { Pool } = require('pg');

const {  userController} = require("../controller/userController");
// const { signinValidate, signupValidate } = require("../middleware/middlewares");
const router = express.Router(); 
// const pool = new Pool({
// router.route("/deleteTutorial").delete(userController.deleteTutorial);
router.post('/user', userController.createUser);
router.post('/verify',userController.verifyUser);

router.put('/user', userController.updateUser);
// router.put('/user',userController.updateUser);
  

module.exports = router;