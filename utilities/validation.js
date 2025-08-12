const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model"); // Needed to repopulate dropdown
const utilities = require("./index"); // Make sure this path is correct!

//  Classification Name Rules
const classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("No spaces or special characters allowed.")
];

// Middleware to Check Classification Input
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav(); // inject nav for consistent layout
    req.flash("message", errors.array().map(e => e.msg).join(", "));
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      message: req.flash("message")
    });
  }
  next();
};

// Inventory Form Rules
const invValidationRules = () => [
  body("classification_id").isInt().withMessage("Please select a valid classification."),
  body("make").trim().notEmpty().withMessage("Make is required."),
  body("model").trim().notEmpty().withMessage("Model is required."),
  body("year").isInt({ min: 1900, max: 2099 }).withMessage("Enter a valid year."),
  body("description").trim().notEmpty().withMessage("Description is required."),
  body("miles").isInt({ min: 0 }).withMessage("Miles must be 0 or more."),
  body("price").isFloat({ min: 0 }).withMessage("Price must be 0 or more."),
  body("color").trim().notEmpty().withMessage("Color is required."),
  body("image").trim().notEmpty().withMessage("Image path is required."),
  body("thumbnail").trim().notEmpty().withMessage("Thumbnail path is required.")
];

// Middleware to Check Inventory Input
const checkInvData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationOptions = await invModel.getClassifications();

    req.flash("message", errors.array().map(e => e.msg).join(" "));
    return res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications: classificationOptions,
      message: req.flash("message")
    });
  }
  next();
};

/* ***************************
 * Check data and return errors for update inventory view
 * ************************** */
const checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_miles,
    inv_price,
    inv_color,
    inv_image,
    inv_thumbnail,
    classification_id
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;

    req.flash("message", errors.array().map(e => e.msg).join(" "));
    return res.render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      message: req.flash("message"),
      errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
  next();
};



//  Export Everything
module.exports = {
  classificationRules,
  checkClassificationData,
  invValidationRules,
  checkInvData,
  checkUpdateData
};
