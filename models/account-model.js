const pool = require("../database") // Connect to PostgreSQL pool

/* *****************************
 *  Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = `
      INSERT INTO account 
      (account_firstname, account_lastname, account_email, account_password, account_type) 
      VALUES ($1, $2, $3, $4, 'Client') 
      RETURNING *;
    `
    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])
    return result.rows[0]
  } catch (error) {
    console.error("Model Error:", error.message)
    return null
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
 *  Get account by email
 * *************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password 
       FROM account WHERE account_email = $1`,
      [account_email]
    )
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
 *  Get account by ID
 * *************************** */
async function getAccountById(accountId) {
  try {
    const result = await pool.query(
      `SELECT account_id, account_firstname, account_lastname, account_email, account_type 
       FROM account WHERE account_id = $1`,
      [accountId]
    )
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById Error:", error.message)
    return null
  }
}

/* *****************************
 *  Update account info
 * *************************** */
async function updateAccount(accountId, firstName, lastName, email) {
  try {
    const sql = `
      UPDATE account 
      SET account_firstname = $1, account_lastname = $2, account_email = $3 
      WHERE account_id = $4
      RETURNING *;
    `
    const result = await pool.query(sql, [firstName, lastName, email, accountId])
    return result.rowCount
  } catch (error) {
    console.error("updateAccount Error:", error.message)
    return null
  }
}

/* *****************************
 *  Update password
 * *************************** */
async function updatePassword(accountId, hashedPassword) {
  try {
    const sql = `
      UPDATE account 
      SET account_password = $1 
      WHERE account_id = $2
      RETURNING *;
    `
    const result = await pool.query(sql, [hashedPassword, accountId])
    return result.rowCount
  } catch (error) {
    console.error("updatePassword Error:", error.message)
    return null
  }
}

async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
    `;
    const data = await pool.query(sql, [hashedPassword, account_id]);
    return data.rowCount > 0;
  } catch (error) {
    throw error;
  }
}



module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}
