const utilities = require("../utilities/");
// const baseController = {};
const baseCont = {};

// baseController.buildHome = async function (req, res) {
//   const nav = await utilities.getNav();
//   res.render("index", { title: "Home", nav });
// };

// module.exports = baseController;

// Build the Home view
baseCont.buildHome = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
  //req.flash("notice", "This is a flash message.");
};

// Intentional error trigger for testing error handling
baseCont.triggerError = async (req, res, next) => {
  const err = new Error(
    "Oh no! There was a crash. Maybe try a different route?"
  );
  err.status = 500;
  throw err;
};

module.exports = baseCont;
