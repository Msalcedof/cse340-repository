const invModel = require("../models/inventory-model")
const Util = {}
const utilities = {};


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/*week 03 new content */
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/*week 03*/
utilities.buildVehicleDetail = function(vehicle) {
  const price = vehicle.price.toLocaleString("en-US", { style: "currency", currency: "USD" });
  const mileage = vehicle.miles.toLocaleString("en-US");

  return `
    <section class="vehicle-detail">
      <div class="vehicle-wrapper">
        <div class="vehicle-image">
          <img src="${vehicle.image}" alt="${vehicle.make} ${vehicle.model}">
        </div>
        <div class="vehicle-info">
          <h1>${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
          <ul>
            <li><strong>Price:</strong> ${price}</li>
            <li><strong>Mileage:</strong> ${mileage} miles</li>
            <li><strong>Color:</strong> ${vehicle.color}</li>
            <li><strong>Transmission:</strong> ${vehicle.transmission}</li>
            <li><strong>Drivetrain:</strong> ${vehicle.drivetrain}</li>
            <li><strong>Fuel Type:</strong> ${vehicle.fuel_type}</li>
            <li><strong>MPG:</strong> ${vehicle.mpg}</li>
          </ul>
        </div>
      </div>
    </section>
  `;
};

module.exports = {
  ...Util,
  ... utilities
};