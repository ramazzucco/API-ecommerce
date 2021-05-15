const db = require("../database/models");

module.exports = async (req, res, next) => {

    const visitasDb = await db.Visita.findOne({
        where: {
            products_id: req.params.id
        }
    });
    if( visitasDb == null ){
        db.Visita.create({
            products_id: req.params.id,
            numero: 1
        });
        next();
    } else {
        const newVisita = visitasDb.numero + 1;
        db.Visita.update({
            products_id: req.params.id,
            numero: newVisita
        },{
            where: { products_id: req.params.id }
        });
        next();
    }
};
