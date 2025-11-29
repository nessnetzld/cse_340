// Routes Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inv-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build single vehicle detail view
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Add classification (GET)
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Add classification (POST)
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory (GET)
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Add inventory (POST)
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
