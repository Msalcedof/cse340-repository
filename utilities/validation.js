const { body, validationResult } = require("express-validator");
const invModel = require("../models/inventory-model"); // Needed to repopulate dropdown
const utilities = require("./"); // For getNav()



const classificationRules = () => [
  body("classification_name")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Classification name is required.")
    .isAlpha()
    .withMessage("Classification must contain only letters."),
];

const checkClassificationData = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("./inventory/add-classification", {
      title: "Add New Classification",
      message: errors.array().map(e => e.msg).join(", "),
    });
  }
  next();
};



// Validation rules for inventory form
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

// Validation checker
const checkInvData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await utilities.getNav();
    const classificationOptions = await invModel.getClassifications();

    return res.render("./inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classifications: classificationOptions,
      message: errors.array().map(e => e.msg).join(" "),
    });
  }
  next();
};



module.exports = { classificationRules, checkClassificationData, invValidationRules,
  checkInvData };
