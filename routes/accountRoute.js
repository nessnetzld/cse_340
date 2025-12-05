const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const accountValidate = require("../utilities/account-validation");

// Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Deliver Registration View
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Default account route (Account Management view)
router.get(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build update account view
router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Route to update account information - POST
router.post(
  "/update/:account_id",
  accountValidate.accountUpdateRules(),
  accountValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Route to change password - POST
router.post(
  "/change-password/:account_id",
  accountValidate.passwordRules(),
  accountValidate.checkPasswordData,
  utilities.handleErrors(accountController.changePassword)
);

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
