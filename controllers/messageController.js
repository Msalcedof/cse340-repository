const messageModel = require("../models/message-model")
const utilities = require("../utilities")

async function buildMessageForm(req, res) {
  const nav = await utilities.getNav()
  res.render("account/message", {
    title: "Send a Message",
    nav,
    errors: null,
    notice: req.flash("notice")
  })
}

async function submitMessage(req, res) {
  const nav = await utilities.getNav()
  const { message_text } = req.body
  const account_id = res.locals.accountData.account_id

  if (!message_text || message_text.trim().length < 5) {
    return res.render("account/message", {
      title: "Send a Message",
      nav,
      errors: [{ msg: "Message must be at least 5 characters." }],
      notice: req.flash("notice")
    })
  }

  await messageModel.submitMessage(account_id, message_text)
  req.flash("notice", "Message submitted successfully.")
  res.redirect("/account/messages")
}

async function viewMessages(req, res) {
  const nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  const messages = await messageModel.getMessagesByAccount(account_id)

  res.render("account/message-history", {
    title: "My Messages",
    nav,
    messages,
    notice: req.flash("notice")
  })
}

module.exports = { buildMessageForm, submitMessage, viewMessages }
