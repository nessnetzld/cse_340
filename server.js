/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const utilities = require("./utilities/");
const inventoryRoute = require("./routes/inventoryRoute");
const baseController = require("./controllers/baseController");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");

/* ***********************
 * View Engine and Templates
 * ********************** */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Account routes
app.use("/account", accountRoute);
app.use("/account", require("./routes/accountRoute"));

// Error trigger route (for testing)
app.get("/trigger-error", utilities.handleErrors(baseController.triggerError));

// Inventory routes
app.use("/inv", inventoryRoute);

/* *********************
 * File Not Found Route - must be last route in list
 * Place after all routes
 * ********************** */
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const status = err.status || 500;
  let message;

  if (status === 404) {
    message = err.message || "Sorry, we appear to have lost that page.";
  } else {
    message =
      err.message || "Oh no! There was a crash. Maybe try a different route?";
  }

  res.status(status).render("errors/error", {
    title: status === 404 ? "404" : "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
