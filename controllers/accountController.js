const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

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

module.exports = accountController;
