const pool = require("../database/")

async function submitMessage(account_id, message_text) {
  const sql = `
    INSERT INTO message (account_id, message_text)
    VALUES ($1, $2)
    RETURNING message_id
  `
  const data = await pool.query(sql, [account_id, message_text])
  return data.rows[0]
}

async function getMessagesByAccount(account_id) {
  const sql = `
    SELECT message_text, created_at
    FROM message
    WHERE account_id = $1
    ORDER BY created_at DESC
  `
  const data = await pool.query(sql, [account_id])
  return data.rows
}

module.exports = { submitMessage, getMessagesByAccount }
