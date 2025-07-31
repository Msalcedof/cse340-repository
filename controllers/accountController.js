const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

/* ****************************************
 *  Deliver login view
 * **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Deliver registration view
 * **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process registration and redirect
 * **************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const errors = []

  if (!account_firstname || account_firstname.trim().length < 2) {
    errors.push("First name must be at least 2 characters.")
  }

  if (!account_lastname || account_lastname.trim().length < 2) {
    errors.push("Last name must be at least 2 characters.")
  }

  if (!account_email || !account_email.includes("@") || account_email.length < 6) {
    errors.push("Please enter a valid email address.")
  }

  if (!account_password || account_password.length < 6) {
    errors.push("Password must be at least 6 characters.")
  }

  if (errors.length > 0) {
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email
    })
  }

  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: ["Something went wrong during registration."],
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
 *  Process login request (placeholder)
 * **************************************** */
async function loginUser(req, res) {
  res.send("login process")
}

/* ****************************************
 *  Deliver My Account view
 * **************************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null
  })
}


module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  loginUser,
  buildAccount
}

