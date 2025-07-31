const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const { classificationRules, checkClassificationData } = require("../utilities/validation");
const { invValidationRules, checkInvData } = require("../utilities/validation");


//Route to render Inventory Management view (Week 04)
router.get("/", invController.buildManagementView);

//Routes for inventory views
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/classifications", invController.buildClassificationView);
router.get("/detail/:inventoryId", invController.buildDetailView);

//Intentional error route (for testing error handler)
router.get("/trigger-error", invController.triggerError);

//week 04//
router.get("/add-classification", invController.buildAddClassification);

router.post(
  "/add-classification",
  classificationRules(),
  checkClassificationData,
  invController.insertClassification
);

router.get("/add-inventory", invController.buildAddInventory);

router.post("/add-inventory", invValidationRules(), checkInvData, invController.insertInventory);

module.exports = router;
