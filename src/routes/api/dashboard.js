const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const DashboardApiController = require('../../controllers/api/dashboardApiController');


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
          cb(null, path.join(__dirname,'../../../public/images'))
    },
    filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    fileFilter(req, file, next) {

      const isPhoto = file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' ? "" : file;

      // console.log(file, "----------->",isPhoto)

      if (isPhoto) {
        next(null, true);
      } else {
          file.error = {
                error: "El formato de archivo debe ser de tipo PNG, JPG o JPEG"
              };
          req.file = file;
        next(null, false);
      }
    }
});


router.get('/widgets', DashboardApiController.widgets);
router.get('/lastProduct', DashboardApiController.lastProduct);
router.get('/categories', DashboardApiController.categories);
router.get('/allProducts', DashboardApiController.allProducts);
router.get("/morevisited", DashboardApiController.moreVisited);

router.get('/category/:categoryId', DashboardApiController.category);

router.get('/usersWithMessages', DashboardApiController.usersWithMessages);

router.get("/messages", DashboardApiController.messages);
router.post("/newmessage", DashboardApiController.newmessage)

router.get('/promotions', DashboardApiController.promotions);
router.post("/promotions",upload.single("image"), DashboardApiController.promotions_store)



module.exports = router;