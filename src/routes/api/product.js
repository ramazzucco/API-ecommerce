const express = require('express');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();
const path = require("path");
const bcrypt = require('bcrypt');
const ProductApiController = require('../../controllers/api/productApiController');
const adminRoute = require('../../middlewares/adminRoute');
const userRoute = require('../../middlewares/userRoute');
const validator = require('../../validators/productValidator');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
          cb(null, path.join(__dirname,'../../../public/images'))
    },
    filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

async function auth(req) {
  const usersApiController = require("../../controllers/api/usersApiController");
  const remembermePath = path.join(__dirname, '../../rememberme.json');

  const rememberme = await JSON.parse(fs.readFileSync(remembermePath,{encoding: 'utf-8'}));
  const rememberedUser = rememberme.find( user => user.token === req.body.token);

  let response;

  if(rememberedUser){
    const [ , token ] = rememberedUser.token.split(' ');

    bcrypt.compareSync(token, rememberedUser.tokenhashed) ? response = true : response = false;

  } else {
    const tokens = usersApiController.tokens().tokens;
    const adminToken = usersApiController.tokens().adminToken[0];

    const [ password, token ] = req.body.token ? req.body.token.split(' ') : [];

    !req.body.token || !tokens.get(password) !== undefined || !tokens.get(password).has(token)
      || req.body.token !== adminToken ? response = true : response = false;
  }

  return response;
}

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 1024 },
    async fileFilter(req, file, next) {

      console.log('desde product route: ',req.body, file)
      const hasauth = await auth(req);
      const isPhoto = file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' ? "" : file;

      console.log('HAY FOTO Y AUTORIZACION?',isPhoto && hasauth)
      if (isPhoto && hasauth) {
        next(null, true);
      } else {

        if(!hasauth){
          file.error = {
            session: 'CSRF Token missing or expired'
          };
          req.file = file;
        } else {
          file.error = {
                param: 'image',
                msg: "El formato de archivo debe ser de tipo PNG, JPG o JPEG"
              };
          req.file = file;
        }

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

router.post("/create", upload.single("image"), validator.product, ProductApiController.store);
router.post('/generatepreference', userRoute, ProductApiController.checkout);

router.put("/update", upload.single("image"), validator.product, ProductApiController.update);

router.delete("/delete", adminRoute, ProductApiController.delete);


module.exports = router;