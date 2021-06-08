let db = require("../../database/models");
const fs = require('fs');
const path = require('path');
const incommingmessagesPath = path.join(__dirname, '../../incommingmessages.json');
const functions = require('../../functions/users');

const { Op } = db.Sequelize;

const controller = {

    widgets: async (req, res) => {
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
        const products = await db.Product.findAll()

        let amount = 0;

        products.map(product => {
            amount = amount + (product.price * product.stock)
        });

        return res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/widgets"
            },
            data: [
                {
                    type: "primary",
                    text: "Mercaderia",
                    value: amount.toLocaleString(),
                    icon: "fa-dollar-sign"
                },
                {
                    type: "success",
                    text: "Ganancias",
                    value: profits.toLocaleString(),
                    icon: "fa-dollar-sign"
                },
                {
                    type: "danger",
                    text: "Pendiente",
                    value: pending.toLocaleString(),
                    icon: "fa-dollar-sign"
                },
            ]
        })

    },
    lastproduct: async (req, res) => {
        const product = await db.Product.findOne({
            limit: 1,
            order: [["id", 'DESC']],
            include: ["category"]
        })

        return res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/lastProduct"
            },
            data: {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                stock: product.stock,
                discount: product.discount,
                category: product.category.title,
                link: `/page/${product.category.id}/${product.id}`
            }
        })
    },
    categories: async (req, res) => {
        const products = await db.Product.findAll({
            attributes: ['id']
        });
        const categorys = await db.Category.findAll({ include: ["products"] })

        return res.json({
            meta: {
                status: 200,
                totalproducts: products.length,
                link: "/api/dashboard/categories"
            },
            data:
                categorys.map(category => {
                    const data = {
                        total_products: category.products.length,
                        category: category
                    }
                    return data;
                })

        })

    },
    views: async (req, res) => {
        const views = await db.Visita.findAll();
        const viewstop10 = await db.Visita.findAll({
            limit: 10,
            order: [["numero", "DESC"]]
        });

        const products = await db.Product.findAll({
            where: {
                id: viewstop10.map( v => { return v.products_id })
            },
            attributes: ["id","name","category_id"]
        })

        const productswhithoutviews = await db.Product.findAll({
            where: {
                id: {
                    [Op.notIn]: views.map( v => { return v.products_id })
                }
            },
            attributes: ["id","name","category_id"]
        })

        const top10 = [];

        for(let n=0; n < viewstop10.length; n++) {
            products.map((product,i)=> {
                if(product.id === viewstop10[n].products_id){
                    top10.push({
                        products_id: viewstop10[n].products_id,
                        category_id: product.category_id,
                        name: product.name,
                        views: viewstop10[n].numero,
                    })
                }
            })
        }

        return res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/morevisited"
            },
            data: {
                views: views.length,
                top10: top10,
                notviews: productswhithoutviews
            }
        })
    },
    products: async (req, res) => {
        try {
            const products = await db.Product.findAll ({include: ['category']});

            return res.json({
                meta: {
                    status: 200
                },
                data: products
            })
        } catch (error) {
            console.log('ERROR EN BASE DE DATOS: ',error)

            res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: {
                    message: '',
                    dbmessage: product ? '' : error.original.sqlMessage
                }
            })
        }
    },
    // category: async (req, res) => {
    //     const productByCategory = await db.Product.findAll({
    //         where: { category_id: req.params.categoryId}
    //     });

    //     let total = 0;

    //     productByCategory.map(product => {
    //         total = total + (Number(product.price) * Number(product.stock));
    //     })
    //     const category = await db.Category.findByPk(req.params.categoryId);

    //     res.json({
    //         meta: {
    //             status: 200,
    //             title: category.title,
    //             totalItems: productByCategory.length,
    //             totalPrice: total.toLocaleString(),
    //             link: `api/dashboard/category/${category.id}`
    //         },
    //         data: productByCategory.map(product => {
    //             return {
    //                 id: product.id,
    //                 name: product.name,
    //                 price: Number(product.price).toLocaleString(),
    //                 description: product.description,
    //                 image: product.image,
    //                 stock: product.stock,
    //                 discount: product.discount,
    //                 category: product.category,
    //                 page: `http://localhost:3000/products/${category.id}/${product.id}`,
    //                 link: `/api/product/${product.id}`
    //             }
    //         })
    //     })
    // },
    promotions: async (req, res) => {
        const promotions = await db.Promotion.findAll();

        const products = await db.Product.findAll({
            where: {
                id: promotions.map(promo => { return promo.products_id })
            }, attributes: ["name"]
        })

        return res.json({
            meta: {
                status: 200,
                totalItems: promotions.length,
                link: 'api/dashboard/promotions'
            },
            data: promotions.map ((promo,i) => {
                return {
                    product_name: products[i].name,
                    image: promo.image,
                    description: promo.description,
                }
            })
        })
    },
    // usersWithMessages: async (req, res) => {
    //     const users = await db.User.findAll();
    //     const messages = await db.Message.findAll({
    //         where: {
    //             users_id: users.map(user => { return user.id })
    //         }
    //     });
    //     const usersId = messages.map( m => { if(m.users_id != 1){ return m.users_id } })
    //     const uniqueUsersId = [...new Set(usersId)]
    //     const usersIdFiltered = uniqueUsersId.filter( user => { return user != undefined })
    //     const usersWithMessages = [];
    //     for(user of users){
    //         usersIdFiltered.map(id => {
    //             if(id == user.id){
    //                 usersWithMessages.push({
    //                     id: user.id,
    //                     name: user.first_name + " " + user.last_name,
    //                 })
    //             }
    //         })
    //     }

    //     return res.json({
    //         meta:{
    //             status: 200,
    //             totalItems: usersWithMessages.length,
    //             link: 'api/dashboard/usersWithMessages'
    //         },
    //         data: usersWithMessages
    //     })
    // },
    users: async (req, res) => {
        const users = await db.User.findAll();

        return res.json({
            meta:{
                status: 200,
                link: 'api/dashboard/users'
            },
            data: users
        })
    },
    user: async (req, res) => {
        try {
            const user = await db.User.findByPk(Number(req.params.id));
            const username = user.dataValues.first_name + ' ' + user.dataValues.last_name;

            const { categorys, purchases, users, messages, orders} = await functions.getData(user.dataValues.id, username);

            return res.json({
                meta: {
                    status: 200
                },
                data: {
                    user: user,
                    categorys: categorys,
                    purchases: purchases,
                    users: users,
                    messages: messages,
                    orders: orders
                }
            })

        } catch (error) {
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: [{
                    field: 'modal',
                    error: error,
                    message: 'No se ha encontrado el usuario'
                }]
            })
        }

    },
    messages: async (req, res) => {
        const messages = await db.Message.findAll();
        const userswhithmessages = await db.User.findAll({
            where: {
                id: messages.map( msg => msg.users_id)
            }
        });
        const incommingmessages = await JSON.parse(fs.readFileSync(incommingmessagesPath,{encoding: 'utf-8'}));

        return res.json({
            meta:{
                status: 200,
                totalItems: messages.length,
                link: 'api/dashboard/messages'
            },
            incommingmessages: incommingmessages,
            userswhithmessages: userswhithmessages,
            data: messages
        })
    },
    changeorder: async (req, res) => {
        const updateorder = await db.Order.update({ status: req.body.status },{
            where: {
                id: req.body.id
            }
        })

        const orders = await db.Order.findAll({
            where: {
                users_id: req.body.users_id
            }
        });

        if(updateorder){
            console.log(updateorder)

            return res.json({
                meta: {
                    status: 200
                },
                data: orders
            })
        } else {
            return res.json({
                meta: {
                    status: 500
                },
                error: true,
                data: {
                    field: 'modal',
                    message: 'No se puedo actualizar el estado de la orden'
                }

            })
        }
    },
    promotions_store: async (req, res) => {

        const errors = req.file.error;
        const promotion = req.body;

        promotion.image = req.file.filename;

        await db.Promotion.create(promotion)

        const newpromotions = await db.Promotion.findAll();

        if(errors){
            return res.json({
                meta: {
                    status: 200,
                },
                error: true,
                data: [{
                    field: 'promotions',
                    message: errors.msg
                }]
            })
        } else {
            return res.json({
                meta: {
                    status: 200,
                },
                data: newpromotions,
            })
        }

    },
    newmessage: async (req, res) => {
        const incommingmessages = await JSON.parse(fs.readFileSync(incommingmessagesPath,{encoding: 'utf-8'}));

        if(req.body.from_name !== 'ADMIN' && req.body.from_name !== 0){
            incommingmessages.push(req.body);
        }

        const newmessage = await db.Message.create(req.body);

        fs.writeFileSync(incommingmessagesPath,JSON.stringify(incommingmessagesdeleted,null,' '));

        if(!newmessage){
            return res.json({
                meta: {
                    status: 200
                },
                error: true,
                modal: true,
                data: [{
                    field: 'message',
                    message: 'No se ha podido enviar el mensaje.'
                }]
            })
        }

        const messages = await db.Message.findAll();

        return res.json({
            meta: {
                status: 200,
            },
            data: messages,
        })
    },
    incommingmessage: async (req, res) => {
        const incommingmessages = await JSON.parse(fs.readFileSync(incommingmessagesPath,{encoding: 'utf-8'}));

        const incommingmessagesdeleted = incommingmessages.filter( message => message.users_id !== Number(req.params.id));

        fs.writeFileSync(incommingmessagesPath,JSON.stringify(incommingmessagesdeleted,null,' '));

        return res.json({
            meta: {
                status: 200
            },
            data: incommingmessagesdeleted
        })
    }
}

module.exports = controller;