const pool = require("../database/")
const invModel = {};

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");

}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}
/*week 03*/

invModel.getVehicleById = async function (inventoryId) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE inventory_id = $1`,
      [inventoryId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("DB error:", error);
    throw error;
  }
};


module.exports = {getClassifications, getInventoryByClassificationId};
