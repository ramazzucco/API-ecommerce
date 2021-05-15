const { check } = require("express-validator")

module.exports = {

    register: [
        check("first_name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un nombre").bail()
            .isAlpha().withMessage("No puedes ingresar numeros en este campo")
            .isLength({ min: 3, max:50 }).withMessage("El nombre debe tener minimo 3 caracteres y maximo 50 caracteres"),
        check("last_name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un apellido").bail()
            .isAlpha().withMessage("No puedes ingresar numeros en este campo")
            .isLength({ min: 3, max:50 }).withMessage("El apellido debe tener minimo 3 caracteres y maximo 50 caracteres"),
        check("email")
            .trim()
            .notEmpty().withMessage("Debe ingresar un email").bail()
            .isEmail().withMessage("Debe ingresar un formato de email válido"),
        check("password")
            .trim()
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
        check("address")
            .trim()
            .optional(),
        check("city")
            .trim()
            .optional()
            .isString().withMessage("No puede ingresar numeros en el campo ciudad"),
        check('avatar')
            .custom((value, { req }) => {
                if (req.file.error === 'type') {
                    throw new Error('La imagen debe ser de tipo PNG, JPG o JPEG');
                } else {
                    return true;
                }
            })
    ],

    login: [
        check("email")
            .notEmpty().withMessage("Debe ingresar un mail valido").bail()
            .isEmail().withMessage("Debe ingresar un mail valido"),
        check("password")
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isLength({ min:8 }).withMessage("La contraseña debe tener minimo 8 caracteres")
    ],

    newavatar: [
        check('avatar')
            .custom((value, { req }) => {
                if (req.file.error === 'type') {
                    throw new Error('La imagen debe ser de tipo PNG, JPG o JPEG');
                } else {
                    return true;
                }
            })
    ],

    changepassword: [
        check("password")
            .trim()
            .notEmpty().withMessage("Debe ingresar una contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
        check("newpassword")
            .trim()
            .notEmpty().withMessage("Debe ingresar una nueva contraseña").bail()
            .isAlphanumeric().withMessage(`La contraseña no puede tener los siguientes caracteres !?¡¿+´*""#$%&/()=`)
            .isLength({ min: 8 }).withMessage("La contraseña debe tener minimo 8 caracteres"),
    ]
}