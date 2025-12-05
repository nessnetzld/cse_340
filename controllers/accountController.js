const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const accountController = {};

/* ****************************************
 *  Deliver login view
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", {
      title: "Login",
      nav,
    });
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Deliver registration view
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Process Registration
 * *************************************** */
// w05-activity
accountController.registerAccount = async function (req, res, next) {
  try {
    const {
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    } = req.body;

    // this hashes the password before storing
    let hashedPassword;
    try {
      // regular password
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash(
        "notice",
        "Sorry, there was an error processing the registration."
      );
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword // hashed password
    );

    if (regResult.rowCount === 0) {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(201).render("account/register", {
        title: "Register",
        nav: await utilities.getNav(),
      });
    } else {
      req.flash("notice", "Congratulations, you are registered.");
      res.status(201).redirect("/account/login");
    }
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Deliver account management view
 * *************************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  let nav = await utilities.getNav();

  // Get account data from res.locals (set by checkJWTToken middleware)
  const accountData = res.locals.accountData;

  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null,
    accountData,
  });
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function (req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;

  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
};

/* ****************************************
 *  Build update account view
 * *************************************** */
accountController.buildUpdateAccount = async function (req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id);
    let nav = await utilities.getNav();
    const accountData = await accountModel.getAccountById(account_id);

    if (!accountData) {
      req.flash("notice", "Account not found.");
      return res.redirect("/account/");
    }

    res.render("account/update-account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    });
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Process account update
 * *************************************** */
accountController.updateAccount = async function (req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } =
      req.body;

    const updateResult = await accountModel.updateAccount(
      parseInt(account_id),
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      // Get updated account data
      const updatedAccount = await accountModel.getAccountById(
        parseInt(account_id)
      );

      // Update JWT token with new data
      delete updatedAccount.account_password;
      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );

      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });

      req.flash("notice", "Account information was successfully updated.");
      res.locals.accountData = updatedAccount;

      let nav = await utilities.getNav();
      res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData: updatedAccount,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the update failed.");
      let nav = await utilities.getNav();
      const accountData = res.locals.accountData;

      res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Process password change
 * *************************************** */
accountController.changePassword = async function (req, res, next) {
  try {
    const { account_id, account_password } = req.body;

    // Hash the new password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hashSync(account_password, 10);
    } catch (error) {
      req.flash(
        "notice",
        "Sorry, there was an error processing the password change."
      );
      let nav = await utilities.getNav();
      const accountData = res.locals.accountData;

      return res.status(500).render("account/update-account", {
        title: "Update Account",
        nav,
        accountData,
        errors: null,
      });
    }

    const updateResult = await accountModel.updatePassword(
      parseInt(account_id),
      hashedPassword
    );

    if (updateResult) {
      req.flash("notice", "Password was successfully changed.");
      let nav = await utilities.getNav();
      const accountData = res.locals.accountData;

      res.render("account/account-management", {
        title: "Account Management",
        nav,
        accountData,
        errors: null,
      });
    } else {
      req.flash("notice", "Sorry, the password change failed.");
      let nav = await utilities.getNav();
      const accountData = res.locals.accountData;

      res.render("account/update-account", {
        title: "Update Account",
        nav,
        accountData,
        errors: null,
      });
    }
  } catch (err) {
    next(err);
  }
};

/* ****************************************
 *  Logout
 * *************************************** */
accountController.logout = async function (req, res, next) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out successfully.");
  res.redirect("/");
};

module.exports = accountController;
