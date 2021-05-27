const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require("path");
const DashboardApiController = require('../../controllers/api/dashboardApiController');
const adminRoute = require('../../middlewares/adminRoute');

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

      const isPhoto = !['image/png','image/jpg','image/jpeg'].includes(file.mimetype) ? "" : file;

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


router.post('/widgets', adminRoute, DashboardApiController.widgets);
router.post('/lastproduct', adminRoute, DashboardApiController.lastproduct);
router.post('/categories', adminRoute, DashboardApiController.categories);
router.post('/allProducts', adminRoute, DashboardApiController.allProducts);
router.post("/views", adminRoute, DashboardApiController.views);
router.post('/users', adminRoute, DashboardApiController.users);
router.post("/messages", adminRoute, DashboardApiController.messages);
// router.get('/promotions', DashboardApiController.promotions);

// router.get('/category/:categoryId', DashboardApiController.category);

// router.post("/newmessage", DashboardApiController.newmessage)
// router.post("/promotions",upload.single("image"), DashboardApiController.promotions_store)



module.exports = router;