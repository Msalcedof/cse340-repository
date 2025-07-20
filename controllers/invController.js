const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/*debugging code intentionally*/
invCont.buildClassificationView = async function (req, res, next) {
  try {
    const data = await invModel.getClassifications(); // this calls your intentionally broken query
    const nav = await utilities.getNav();
    res.render("./inventory/classification-list", {
      title: "Classification List",
      nav,
      classifications: data.rows, // or just `data` depending on your query structure
    });
  } catch (error) {
    console.error("Error loading classification view:", error);
    res.status(500).send("There was an error fetching classification data.");
  }
};





module.exports = invCont