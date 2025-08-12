const utilities = require("./index") // Adjust this if needed
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}


function registrationRules() {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters.")
  ]
}


/* **********************************
 * Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
        throw new Error("Email exists. Please log in or use different email")
        }
    }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      .withMessage("Password must include an uppercase letter, a number, and a special character."),
  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}



function updateAccountRules() {
  return [
    body("first_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First name must be at least 2 characters."),
    body("last_name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters."),
    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
  ]
}

function checkUpdateData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = require("./index").getNav()
    nav.then(navData => {
      res.render("account/update", {
        title: "Update Account",
        nav: navData,
        account: req.body,
        errors: errors.array()
      })
    })
  } else {
    next()
  }
}

function checkRegData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = require("./index").getNav()
    nav.then(navData => {
      res.render("account/register", {
        title: "Register",
        nav: navData,
        errors: errors.array(),
        account_firstname: req.body.account_firstname,
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email
      })
    })
  } else {
    next()
  }
}



const loginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}




validate.passwordRules = () => {
  return [
    body("password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters long.")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter.")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter.")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number.")
      .matches(/[^A-Za-z0-9]/)
      .withMessage("Password must contain at least one special character.")
  ]
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    res.render("account/update-password", {
      title: "Update Password",
      nav,
      errors,
      account_id: req.body.account_id
    })
    return
  }
  next()
}








function checkLoginData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const nav = require("./index").getNav()
    nav.then(navData => {
      res.render("account/login", {
        title: "Login",
        nav: navData,
        errors: errors.array(),
        account_email: req.body.account_email
      })
    })
  } else {
    next()
  }
}




module.exports = {
  registrationRules,
  checkRegData,
  loginRules,
  checkLoginData,
  updateAccountRules,
  checkUpdateData,
  passwordRules: validate.passwordRules,
  checkPasswordData: validate.checkPasswordData
}

