const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


/*debugging code intentionally*/

const routers = express.Router();


router.get("/classifications", invController.buildClassificationView);





module.exports = router;