const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");
const messageController = require("../controllers/messageController")
console.log("Controller keys:", Object.keys(accountController))
console.log("Validation keys:", Object.keys(validate))


//  Middleware for JWT-based access control
const { checkJWT } = require("../utilities"); // Make sure this is exported from utilities/index.js

//  Week 05: Account Update Routes
router.get(
  "/update/:accountId",
  checkJWT,
  utilities.handleErrors(accountController.buildUpdateView)
);

router.post(
  "/update",
  checkJWT,
  validate.updateAccountRules(), // Optional: add validation rules
  validate.checkUpdateData,      // Optional: add validation handler
  utilities.handleErrors(accountController.updateAccount)
);

router.post(
  "/update-password",
  checkJWT,
  validate.passwordRules(),      // Optional: add password validation
  validate.checkPasswordData,    // Optional: add password validation handler
  utilities.handleErrors(accountController.updatePassword)
);

//  Default account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

//  Login and Registration Views
router.get("/login", accountController.buildLogin);
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//  Registration Form Submission
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//  Login Form Submission
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/logout", accountController.logout)

router.get("/message", checkJWT, messageController.buildMessageForm)
router.post("/message", checkJWT, messageController.submitMessage)
router.get("/messages", checkJWT, messageController.viewMessages)

module.exports = router;
