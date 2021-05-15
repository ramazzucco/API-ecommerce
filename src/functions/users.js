const db = require('../database/models');
const { Op } = db.Sequelize;

const getData = async (id, username) => {

    const orders = await db.Order.findAll({
        attributes: [ "number" ],
        where:{
            users_id: id
        }
    });

    const items = await db.Item.findAll({
        where: {
            orders_id: orders.map( order => { return order.number })
        },
        order: ["products_id"]
    });

    const purchases = items.map( item => {
        return {
            id: item.id,
            order: item.orders_id,
            name: item.name,
            price: item.price,
            priceWithoutDiscount: item.priceWithoutDiscount,
            quantity: item.quantity,
            discount: item.discount,
            image: item.image
        };
    });

    const messages = await db.Message.findAll({
        where: {
            [Op.or]: [{ users_id: id }, { to_name: username }]
        }
    });

    const categorys = await db.Category.findAll();

    return { orders, items, purchases, messages, categorys }
}

const getDataAdmin = async () => {

    const categorys = await db.Category.findAll({
        include: [{ association: "products" }],
    });

    const products = await db.Product.findAll({ include: "category" });

    const users = await db.User.findAll();

    const messages = await db.Message.findAll({
        where: {
            users_id: users.map(user => { return user.id })
        }
    });

    const orderSuccess = await db.Order.findAll({
        where: {
            status: "success"
        }
    });

    const profits = await db.Item.sum("price",{
        where: {
            orders_id: orderSuccess.map(order => { return order.id})
        }
    });

    const orderPending = await db.Order.findAll({
        where: {
            status: "pending"
        }
    });

    const pending = await db.Item.sum("price",{
        where: {
            orders_id: orderPending.map(order => { return order.id})
        }
    });

    const promotions = await db.Promotion.findAll();

    return {
        categorys,
        products,
        users,
        messages,
        orderSuccess,
        profits,
        orderPending,
        pending,
        promotions
    }
}

const getAdmins = async () => {

    const admins = await db.User.findAll({
        where: {
            status: 2
        }
    }).map( admin => { return admin.email })

    return admins;
}

module.exports = { getData, getDataAdmin, getAdmins }