const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invController = {};

/* ***************************
 * Build inventory by classification view
 ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classificationId);
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const nav = await utilities.getNav();

    console.log("🔍 Vehicle inventory results:", data);

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).render("errors/error", {
        title: "No Vehicles Found",
        nav,
        message: "We couldn't find any vehicles in this category.",
      });
    }

    const grid = await utilities.buildInventoryGrid(data);
    const className = data[0]?.classification_name || "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    console.error("🔥 Error in buildByClassificationId:", error);
    next(error);
  }
};

/* ************************************
 * Build classification list (for debugging)
 ************************************ */
invController.buildClassificationView = async function (req, res, next) {
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
 * Build vehicle detail view
 ************************** */
invController.buildDetailView = async function (req, res, next) {
  try {
    const inventoryId = parseInt(req.params.inventoryId);

    if (isNaN(inventoryId)) {
      return res.status(400).render("errors/error", {
        title: "Invalid Request",
        nav: await utilities.getNav(),
        message: "Invalid vehicle ID provided.",
      });
    }

    const data = await invModel.getVehicleById(inventoryId);
    const nav = await utilities.getNav();

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).render("errors/error", {
        title: "Vehicle Not Found",
        nav,
        message: "Sorry, we couldn't find that vehicle.",
      });
    }

    const vehicleHTML = utilities.buildVehicleDetail(data);

    res.status(200).render("./inventory/detail", {
      title: `${data.inv_make || "Vehicle"} ${data.inv_model || ""}`,
      nav,
      vehicleHTML,
    });
  } catch (error) {
    console.error("💥 Error loading vehicle detail:", error);
    res.status(500).render("errors/error", {
      title: "Server Error",
      nav: await utilities.getNav(),
      message: "Something went wrong loading the vehicle details. Please try again later.",
    });
  }
};

/* ***************************
 * Error handler for testing
 ************************** */
invController.triggerError = function (req, res, next) {
  return next(new Error("Intentional server error for testing."));
};

/* ***************************
 * Inventory Management View (Week 04)
 ************************** */
invController.buildManagementView = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Add Classification
 ************************** */
invController.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

invController.insertClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const addResult = await invModel.addClassification(classification_name);

    if (addResult) {
      req.flash("message", "New classification added successfully.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add classification.");
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 * Add Inventory Vehicle
 ************************** */
invController.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    const classificationOptions = await invModel.getClassifications();

    res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications: classificationOptions,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

invController.insertInventory = async function (req, res, next) {
  try {
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
    } = req.body;

    const result = await invModel.insertInventory({
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
    });

    if (result) {
      req.flash("message", "Vehicle successfully added.");
      res.redirect("/inv");
    } else {
      req.flash("message", "Sorry, something went wrong.");
      res.redirect("/inv/add-inventory");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invController;
