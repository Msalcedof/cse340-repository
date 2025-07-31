const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const validate = require("../utilities/account-validation")
const accountController = require("../controllers/accountController")

// Route to deliver the login view
router.get("/login", accountController.buildLogin)

// Route to deliver the register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to process registration form submission
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to deliver the My Account view
router.get("/", utilities.handleErrors(accountController.buildAccount))


// Route to process login form submission
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.loginUser)
)

module.exports = router
