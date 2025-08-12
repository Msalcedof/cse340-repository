const pool = require("../database/");
const invModel = {};

// Get all classification data
invModel.getClassifications = async function () {
  try {
    const result = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
    return result.rows;
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error;
  }
};

// Get inventory items by classification_id
invModel.getInventoryByClassificationId = async function (classification_id) {
  try {
    const data = await pool.query(
      `SELECT i.*, c.classification_name 
       FROM public.inventory AS i
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
};

// ✅ Get vehicle details by inventory_id
invModel.getVehicleById = async function (inventory_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM inventory WHERE inventory_id = $1`,
      [inventory_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
};

// Add a new classification
invModel.addClassification = async function (classification_name) {
  try {
    const sql = `
      INSERT INTO classification (classification_name)
      VALUES ($1) RETURNING *`;
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error:", error);
    throw error;
  }
};

// Insert a new inventory item
const insertInventory = async function(vehicleData) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_miles,
    inv_price,
    inv_color,
    inv_image,
    inv_thumbnail
  } = vehicleData;

  try {
    const sql = `
      INSERT INTO inventory (
        classification_id, inv_make, inv_model, inv_year, inv_description,
        inv_miles, inv_price, inv_color, inv_image, inv_thumbnail
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10
      )
      RETURNING *;
    `;
    const data = await pool.query(sql, [
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_miles,
      inv_price,
      inv_color,
      inv_image,
      inv_thumbnail
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("insertInventory error:", error);
    throw error;
  }
};

/* ***************************
 * ✅ Update Inventory Data
 * ************************** */
const updateInventory = async function (
  inventory_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql = `
      UPDATE public.inventory
      SET inv_make = $1, inv_model = $2, inv_description = $3,
          inv_image = $4, inv_thumbnail = $5, inv_price = $6,
          inv_year = $7, inv_miles = $8, inv_color = $9,
          classification_id = $10
      WHERE inventory_id = $11
      RETURNING *;
    `;
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inventory_id
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("updateInventory error:", error);
    throw error;
  }
};

// Export all functions
module.exports = {
  ...invModel,
  insertInventory,
  updateInventory
};
