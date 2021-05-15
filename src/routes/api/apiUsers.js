const express = require('express');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const usersApiController = require('../../controllers/api/usersApiController');
const userRoute = require("../../middlewares/userRoute");
const validator = require("../../validators/userValidator");

var storage = multer.diskStorage({
    destination: path.resolve(__dirname,'../../../public/images/avatars'),
    filename: (req, file, cb) => {
          cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
  })
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
            file.error = "type";
            req.file = file;
            return cb(null, false, new Error('Está mal el mimeType'));
        }
        if(file.mimetype === "undefined"){
          return cb(null, true);
        }
        console.log(file)
        return cb(null, true);
    }
});

router.get('/', usersApiController.index);
router.get('/:id', userRoute, usersApiController.profile);

router.post("/register", upload.single("avatar"), validator.register, usersApiController.create);
router.post("/login", validator.login, usersApiController.login);
router.post('/session', userRoute, usersApiController.session);
router.post('/savesession', userRoute, usersApiController.savesession);
router.post('/logout', userRoute, usersApiController.logout);
router.post("/messages", userRoute, usersApiController.messages);
router.post('/email', usersApiController.email);
router.post('/newavatar', upload.single("avatar"), validator.newavatar, usersApiController.newavatar);

router.put("/update", userRoute, validator.register, usersApiController.update);

router.patch('/changepassword', userRoute, validator.login, usersApiController.changepassword)

router.delete('/delete', userRoute, usersApiController.delete);

module.exports = router;
