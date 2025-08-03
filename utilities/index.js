const invModel = require("../models/inventory-model");

// Utility Container
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    const data = await invModel.getClassifications();
    console.log("🔍 DEBUG: getClassifications returned:", data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("getNav failed: No classifications returned from DB");
      return `<ul><li><a href="/" title="Home page">Home</a></li></ul>`;
    }

    //  Filter out duplicate classification names
    const uniqueClassifications = [];
    const seenNames = new Set();

    for (let item of data) {
      if (!seenNames.has(item.classification_name)) {
        seenNames.add(item.classification_name);
        uniqueClassifications.push(item);
      }
    }

    let list = '<ul id="nav-list">';
    list += '<li><a href="/" title="Home page">Home</a></li>';

    //  Use filtered data to build the nav
    uniqueClassifications.forEach((row) => {
      list += `<li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
    });

    list += "</ul>";
    return list;

  } catch (error) {
    console.error("getNav error:", error.message);
    return "<ul><li><a href='/'>Home</a></li></ul>"; // fallback nav
  }
};


/* **************************************
 * Build the classification view HTML
 ************************************** */
Util.buildInventoryGrid = async function (data) {
  let grid = "";

  // Guard clause: check if data is a valid array
  if (!Array.isArray(data) || data.length === 0) {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    return grid;
  }

  grid += '<ul id="inv-display">';
  data.forEach(vehicle => {
    // Fallback values to prevent rendering issues
    const { inv_id, inv_make = "Unknown", inv_model = "Model", inv_price = 0, inv_thumbnail = "/images/no-image.png" } = vehicle;

    grid += `
      <li>
        <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
          <img src="/${inv_thumbnail}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" />

        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
              ${inv_make} ${inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(inv_price)}</span>
        </div>
      </li>
    `;
  });
  grid += "</ul>";

  return grid;
};


/* ****************************************
 * Middleware for Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* **************************************
 * Build detailed vehicle HTML view
 ************************************** */
Util.buildVehicleDetail = function(vehicle) {
  if (!vehicle) {
    return `<p>Vehicle data could not be loaded.</p>`;
  }

  const price = vehicle.price
    ? vehicle.price.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : "N/A";

  const mileage = vehicle.miles
    ? vehicle.miles.toLocaleString("en-US")
    : "N/A";

  return `
    <section class="vehicle-detail">
      <div class="vehicle-wrapper">
        <div class="vehicle-image">
          <img src="${vehicle.image || "#"}" alt="${vehicle.make || "Unknown"} ${vehicle.model || ""}">
        </div>
        <div class="vehicle-info">
          <h1>${vehicle.year || "Year"} ${vehicle.make || "Make"} ${vehicle.model || "Model"}</h1>
          <ul>
            <li><strong>Price:</strong> ${price}</li>
            <li><strong>Mileage:</strong> ${mileage} miles</li>
            <li><strong>Color:</strong> ${vehicle.color || "N/A"}</li>
            <li><strong>Transmission:</strong> ${vehicle.transmission || "N/A"}</li>
            <li><strong>Drivetrain:</strong> ${vehicle.drivetrain || "N/A"}</li>
            <li><strong>Fuel Type:</strong> ${vehicle.fuel_type || "N/A"}</li>
            <li><strong>MPG:</strong> ${vehicle.mpg || "N/A"}</li>
          </ul>
        </div>
      </div>
    </section>
  `;
};


//Clean export
module.exports = Util;
