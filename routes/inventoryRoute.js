// Routes Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const invValidate = require("../utilities/inv-validation");

// Route to build inventory by classification view - PUBLIC
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build single vehicle detail view - PUBLIC
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
);

// Management view - Admin or Employee only
router.get(
  "/",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildManagement)
);

// Route to get inventory by classification_id (JSON) - Admin or Employee only
router.get(
  "/getInventory/:classification_id",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view - Admin or Employee only
router.get(
  "/edit/:inv_id",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildEditInventory)
);

// Route to update inventory / POST / Admin or Employee only
router.post(
  "/update",
  utilities.checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view - Admin or Employee only
router.get(
  "/delete/:inv_id",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildDeleteConfirm)
);

// Route to delete inventory / POST / Admin or Employee only
router.post(
  "/delete",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.deleteInventory)
);

// Add classification / GET / Admin or Employee only
router.get(
  "/add-classification",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddClassification)
);

// Add classification / POST / Admin or Employee only
router.post(
  "/add-classification",
  utilities.checkAdminEmployee,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add inventory / GET / Admin or Employee only
router.get(
  "/add-inventory",
  utilities.checkAdminEmployee,
  utilities.handleErrors(invController.buildAddInventory)
);

// Add inventory / POST / Admin or Employee only
router.post(
  "/add-inventory",
  utilities.checkAdminEmployee,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
