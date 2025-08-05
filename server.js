// 🟢 WHERE: Load environment variables FIRST
require("dotenv").config();

/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/*  HOW: Require core modules and middleware */
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const path = require("path"); // consistent static pathing
const app = express();

/*  Route and utility imports */
const static = require("./routes/static");
const inventoryRoutes = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const baseControllers = require("./controllers/baseController");
const utilities = require('./utilities/index');
const handleErrors = require("./utilities/errorHandler");
const pool = require('./database/');

/*  View engine configuration */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/*  Serve static assets from /public */
app.use(express.static(path.join(__dirname, "public")));

/*  Middleware setup */

// Parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable session management with PostgreSQL store
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}));

// Enable flash messages
app.use(flash());

//  HOW: Provide flash messages and notices to views
app.use((req, res, next) => {
  res.locals.notice = req.flash("notice");
  res.locals.messages = require("express-messages")(req, res);
  next();
});

/*  Routing */
app.use(static);              // Static routes
app.use("/inv", inventoryRoutes); // Inventory routes
app.use("/account", accountRoute); // Account routes
app.get("/", utilities.handleErrors(baseControllers.buildHome)); // Home route

/*  Error Handlers */

// 404 Not Found
app.use(async (req, res) => {
  const nav = await utilities.getNav(); //  Use nav even on error views
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "Sorry, we appear to have lost that page.",
    nav,
  });
});

// 500 Internal Server Error
app.use(handleErrors);

/*  Start server with values from .env */
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
