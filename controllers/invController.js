const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;

    const result = await invModel.getInventoryByClassificationId(classification_id);
    const data = result.rows; //extract vehicle list from query result
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();

    const className = data[0]?.classification_name || "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error); // middleware will catch it
  }
};

/* ************************************
 * Build classification list (debugging)
 ************************************ */
invCont.buildClassificationView = async function (req, res, next) {
  try {
    const data = await invModel.getClassifications();
    const nav = await utilities.getNav();

    res.render("./inventory/classification-list", {
      title: "Classification List",
      nav,
      classifications: data.rows,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Build specific vehicle detail view
 ************************** */
invCont.buildDetailView = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inventoryId);
    const data = await invModel.getVehicleById(inventoryId);
    const nav = await utilities.getNav();

    if (!data) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, we couldn't find that vehicle.",
      });
    }

    const vehicleHTML = utilities.buildVehicleDetail(data);
    res.render("./inventory/detail", {
      title: `${data.make} ${data.model}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Intentional error controller (Task 3)
 ************************** */
invCont.triggerError = function (req, res, next) {
  return next(new Error("Intentional server error for testing."));
};

module.exports = invCont;
