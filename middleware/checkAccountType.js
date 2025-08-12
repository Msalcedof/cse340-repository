function checkAccountType(req, res, next) {
  const accountData = res.locals.accountData

  if (!accountData || !["Employee", "Admin"].includes(accountData.account_type)) {
    req.flash("error", "You must be logged in with proper credentials to access this page.")
    return res.redirect("/account/login")
  }

  next()
}

module.exports = checkAccountType
