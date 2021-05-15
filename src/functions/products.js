let db = require("../database/models");
const { Op } = db.Sequelize;

const orderBy = async (category,orderby,direction,min,max) => {

    let products;

    if(max && !min){
        products = await db.Product.findAll({
            where: {
                category_id: Number(category),
                price: {
                    [Op.lt]: max,
                }
            },
            include: ['category'],
            order: [
                [orderby, direction]
            ]
        });
    }

    if(min && max){
        products = await db.Product.findAll({
            where: {
                category_id: Number(category),
                price: {
                    [Op.between]: [min, max],
                }
            },
            include: ['category'],
            order: [
                [orderby, direction]
            ]
        });
    }

    if(min && !max){
        products = await db.Product.findAll({
            where: {
                category_id: Number(category),
                price: {
                    [Op.gt]: min,
                }
            },
            include: ['category'],
            order: [
                [orderby, direction]
            ]
        });
    }

    if(!min && !max){
        products = await db.Product.findAll({
            where: {
                category_id: Number(category)
            },
            include: ['category'],
            order: [
                [orderby, direction]
            ]
        });
    }

    if(!min && !max){
        products = await db.Product.findAll({
            where: {
                category_id: Number(category)
            },
            include: ['category'],
            order: [
                [orderby, direction]
            ]
        });
    }

    return products;
}

module.exports = { orderBy }