const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const { validationResult } = require("express-validator");

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

//Assignment 4
/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } catch (err) {
    next(err);
  }
};

//Assignment 4
/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "/images/vehicles/no-image.png",
    inv_thumbnail: "/images/vehicles/no-image-tn.png",
    inv_price: "",
    inv_miles: "",
    inv_color: "",
    classification_id: "",
  });
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (addResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`);
    nav = await utilities.getNav();
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.");
    let classificationList = await utilities.buildClassificationList(
      classification_id
    );
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

// Assignment 4.2
invCont.buildAddClassification = async function (req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
    });
  } catch (err) {
    next(err);
  }
};

invCont.addClassification = async function (req, res, next) {
  try {
    const errors = validationResult(req);
    const { classification_name } = req.body;

    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      return res.status(400).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors,
        classification_name,
      });
    }

    // insert classification data into DB
    const result = await invModel.addClassification(classification_name);

    if (result && result.rowCount > 0) {
      const nav = await utilities.getNav();
      req.flash(
        "notice",
        `Classification "${classification_name}" added successfully.`
      );
      return res.status(201).render("inventory/management", {
        title: "Inventory Management",
        nav,
      });
    } else {
      const nav = await utilities.getNav();
      req.flash("notice", "Sorry, could not add the classification.");
      return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
        nav,
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = invCont;
