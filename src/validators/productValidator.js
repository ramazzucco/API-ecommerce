const { check } = require("express-validator")

module.exports = {
    product: [
        check("category_id")
            .trim()
            .notEmpty().withMessage("Debe ingresar una categoria").bail(),
        check("marca")
            .trim()
            .notEmpty().withMessage("Debe ingresar una marca").bail()
            .isAlpha().withMessage("No puedes ingresar numeros en este campo")
            .isLength({ max:20 }).withMessage("Maximo 20 caracteres"),
        check("name")
            .trim()
            .notEmpty().withMessage("Debe ingresar un nombre").bail(),
        check("price")
            .trim()
            .notEmpty().withMessage("Debe ingresar un precio").bail()
            .isNumeric().withMessage('Debe ingresar un numero'),
        check("discount")
            .trim()
            .isNumeric().withMessage('Debe ingresar un numero')
            .notEmpty().withMessage("Si no tiene descuento coloque 0").bail(),
        check("stock")
            .trim()
            .isNumeric().withMessage('Debe ingresar un numero')
            .notEmpty().withMessage("Si no tiene unidades disponibles coloque 0").bail(),
        check('image')
            .custom((value, { req }) => {
                if (req.file.error === 'type') {
                    throw new Error('La imagen debe ser de tipo PNG, JPG o JPEG');
                } else {
                    return true;
                }
            }),
        check('description')
            .trim()
            .notEmpty().withMessage("Debe ingresar una descripcion").bail(),
    ]
}
