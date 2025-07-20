const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


/*debugging code intentionally*/

const routers = express.Router();


router.get("/classifications", invController.buildClassificationView);

/*week03*/
router.get("/detail/:inventoryId", invController.buildDetailView);
router.get("/trigger-error", invController.triggerError);




module.exports = router;