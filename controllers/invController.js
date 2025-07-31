const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invController = {};
const inventoryModel = require("../models/inventory-model");

/* ***************************
 * Build inventory by classification view
 ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const result = await invModel.getInventoryByClassificationId(classification_id);
    const data = result.rows;
    const grid = await utilities.buildClassificationGrid(data);
    const nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Vehicles";

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ************************************
 * Build classification list (debugging)
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
 * Build specific vehicle detail view
 ************************** */
invController.buildDetailView = async function (req, res, next) {
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
invController.triggerError = function (req, res, next) {
  return next(new Error("Intentional server error for testing."));
};

/* ***************************
 * Inventory Management View (Week 04)
 ************************** */
invController.buildManagementView = async function(req, res, next) {
  try {
    const nav = await utilities.getNav(); // Add this if your view needs it
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

invController.buildAddClassification = async function(req, res, next) {
  try {
    const nav = await utilities.getNav(); // Optional
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("message"),
    });
  } catch (error) {
    next(error);
  }
};

invController.insertClassification = async function(req, res, next) {
  try {
    const { classification_name } = req.body;
    const addResult = await inventoryModel.addClassification(classification_name);

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

invController.buildAddInventory = async function (req, res, next) {
  try {
    const nav = await utilities.getNav(); // For your layout’s nav bar
    const classificationOptions = await invModel.getClassifications(); // Dropdown data

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
      make,
      model,
      year,
      description,
      miles,
      price,
      color,
      image,
      thumbnail
    } = req.body;

    const result = await inventoryModel.insertInventory({
      classification_id,
      make,
      model,
      year,
      description,
      miles,
      price,
      color,
      image,
      thumbnail
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
