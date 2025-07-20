/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/


/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()

const static = require("./routes/static")
/*week03 new content*/
const inventoryRoutes = require("./routes/inventoryRoute");
const baseControllers = require("./controllers/baseController");
const utilities = require('./utilities/index');
const handleErrors = require("./utilities/errorHandler");

/* ***********************
 * view engine and template
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/*serve static files*/
app.use(express.static("public/site"));

/* ***********************
 * Routes
 *************************/
app.use(static)

//index route****
/*week03 new content*/
// Inventory routes*/
app.use("/inv", inventoryRoutes)

// Home route wrapped in async error handler
app.get("/", utilities.handleErrors(baseControllers.buildHome));

// 404 handler
app.use((req, res) => {
  const nav = ""; // or await getNav() if needed
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "Sorry, we appear to have lost that page.",
    nav,
  });
});

// 500 handler
app.use(handleErrors);


/*week03 new content*/
/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message,
    nav
  })
})




/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
