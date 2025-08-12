const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const invValidation = require("../utilities/validation")
const utilities = require("../utilities/")
const checkAccountType = require("../middleware/checkAccountType")

const { classificationRules, checkClassificationData } = invValidation
const { invValidationRules, checkInvData } = invValidation

// 🔧 Inventory Management View
router.get("/", invController.buildManagementView)

// 🔧 Inventory Views
router.get("/type/:classificationId", invController.buildByClassificationId)
router.get("/classifications", invController.buildClassificationView)
router.get("/detail/:inventoryId", invController.buildDetailView)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// 🔧 Edit Inventory View
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryView))

// 🔧 Intentional Error Route (for testing)
router.get("/trigger-error", invController.triggerError)

// 🔐 Protected Routes — Add Classification
router.get("/add-classification", checkAccountType, invController.buildAddClassification)

router.post(
  "/add-classification",
  checkAccountType,
  classificationRules(),
  checkClassificationData,
  invController.insertClassification
)

// 🔐 Protected Routes — Add Inventory
router.get("/add-inventory", checkAccountType, invController.buildAddInventory)

router.post(
  "/add-inventory",
  checkAccountType,
  invValidationRules(),
  checkInvData,
  invController.insertInventory
)

// 🔧 Update Inventory
router.post(
  "/update/",
  invValidationRules(),
  invValidation.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
