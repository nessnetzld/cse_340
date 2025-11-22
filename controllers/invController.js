const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

module.exports = invCont;

// Single vehicle detail view Controller
// invCont.buildByInventoryId = async function (req, res, next) {
//   try {
//     const inv_id = req.params.invId;
//     const data = (await invModel.getInventoryById)
//       ? await invModel.getInventoryById(inv_id)
//       : await invModel.getInventoryByInvId(inv_id);
//     // data may be rows array or single object depending on model
//     const vehicle = data.rows
//       ? data.rows[0]
//       : Array.isArray(data)
//       ? data[0]
//       : data;
//     if (!vehicle) {
//       return res.status(404).render("errors/error", {
//         title: "Not found",
//         message: "Vehicle not found.",
//         nav: await utilities.getNav(),
//       });
//     }
//     const nav = await utilities.getNav();
//     res.render("inventory/detail", {
//       title: `${vehicle.inv_make} ${vehicle.inv_model}`,
//       nav,
//       vehicle,
//     });
//   } catch (err) {
//     next(err);
//   }
// };

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getInventoryById(inv_id);
    const vehicle = data.rows
      ? data.rows[0]
      : Array.isArray(data)
      ? data[0]
      : data;

    if (!vehicle) {
      const nav = await utilities.getNav();
      return res.status(404).render("errors/error", {
        title: "404 Error",
        message: "Sorry, vehicle details could not be found.",
        nav,
      });
    }

    const nav = await utilities.getNav();
    const detail = await utilities.buildVehicleDetail(vehicle);

    res.render("inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detail,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = invCont;
