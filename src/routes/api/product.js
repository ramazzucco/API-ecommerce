const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require("path");
const ProductApiController = require('../../controllers/api/productApiController');
const userRoute = require('../../middlewares/userRoute');

const storage = multer.diskStorage({
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

router.get('/', ProductApiController.index);
router.get('/orderby', ProductApiController.orderby);
router.get("/search", ProductApiController.search);
router.get('/successfulpayment', ProductApiController.successPayment);
router.get('/paymentdeclined', ProductApiController.failedPayment);
router.get('/views', ProductApiController.views);
router.get('/:id', ProductApiController.show);

router.post("/create", upload.single("image"), ProductApiController.store);
router.post('/generatepreference', userRoute, ProductApiController.checkout);

router.put("/update/:id", ProductApiController.update);

router.delete("/delete/:id", ProductApiController.delete);


module.exports = router;