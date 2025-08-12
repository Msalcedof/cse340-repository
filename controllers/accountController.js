const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()





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
 *  Deliver Account Update View
 * **************************************** */
async function buildUpdateView(req, res) {
  const nav = await utilities.getNav()
  const accountId = req.params.accountId
  const accountData = await accountModel.getAccountById(accountId)

  res.render("account/update", {
    title: "Update Account",
    nav,
    account: accountData,
    errors: null,
    notice: req.flash("notice")
  })
}

/* ****************************************
 *  Process Account Info Update
 * **************************************** */
async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { first_name, last_name, email } = req.body
  const accountId = res.locals.accountData.account_id

  const updateResult = await accountModel.updateAccount(accountId, first_name, last_name, email)

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account")
  } else {
    req.flash("notice", "Account update failed.")
    res.status(400).render("account/update", {
      title: "Update Account",
      nav,
      account: { first_name, last_name, email },
      errors: ["Unable to update account."]
    })
  }
}

/* ****************************************
 *  Process login request
 * **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    const match = await bcrypt.compare(account_password, accountData.account_password)
    if (match) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })

      const cookieOptions = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        ...(process.env.NODE_ENV !== "development" && { secure: true })
      }

      res.cookie("jwt", accessToken, cookieOptions)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login Error:", error.message)
    req.flash("notice", "Login failed due to server error.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: ["Server error during login."],
      account_email,
    })
  }
}

/* ****************************************
 *  Deliver My Account view
 * **************************************** */
async function buildAccount(req, res) {
  const nav = await utilities.getNav()
  res.render("account/account", {
    title: "My Account",
    nav,
    errors: null,
    notice: req.flash("notice")
  })
}

/* ****************************************
 *  Deliver Account Management View
 * **************************************** */
async function buildAccountManagement(req, res) {
  const nav = await utilities.getNav()
  const accountData = res.locals.accountData

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    accountData,
    notice: req.flash("notice"),
    errors: null
  })
}

/* ****************************************
 *  Process Password Update
 * **************************************** */
async function updatePassword(req, res) {
  const { account_id, password, confirm_password } = req.body
  const nav = await utilities.getNav()
  const errors = {}

  // Server-side validation
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters."
  }
  if (password !== confirm_password) {
    errors.confirm_password = "Passwords do not match."
  }

  // If there are validation errors, re-render the form with sticky data
  if (Object.keys(errors).length > 0) {
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account: await accountModel.getAccountById(account_id),
      errors,
      messages: [],
      formData: req.body
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account")
    } else {
      req.flash("notice", "Password update failed.")
      res.render("account/update", {
        title: "Update Account",
        nav,
        account: await accountModel.getAccountById(account_id),
        errors: { password: "Unable to update password." },
        messages: [],
        formData: req.body
      })
    }
  } catch (error) {
    console.error("Password update error:", error)
    req.flash("notice", "An error occurred.")
    res.render("account/update", {
      title: "Update Account",
      nav,
      account: await accountModel.getAccountById(account_id),
      errors: { password: "Server error. Please try again." },
      messages: [],
      formData: req.body
    })
  }
}

function logout(req, res) {
  res.clearCookie("jwt") // Remove JWT
  req.flash("notice", "You have been logged out.")
  res.redirect("/") // Or redirect to login page
}



// Export all functions
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccount,
  buildAccountManagement,
  buildUpdateView,
  updateAccount,
  updatePassword,
  logout
}

