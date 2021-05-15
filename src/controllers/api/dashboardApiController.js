let db = require("../../database/models");
const { sequelize } = db.Sequelize;

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
        })
        res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/widgets"
            },
            data: [
                {
                    type: "primary",
                    text: "Total en Mercaderia",
                    value: amount,
                    icon: "fa-dollar-sign"
                },
                {
                    type: "success",
                    text: "Ganancias",
                    value: profits,
                    icon: "fa-dollar-sign"
                },
                {
                    type: "danger",
                    text: "Pendiente",
                    value: pending,
                    icon: "fa-dollar-sign"
                },
            ]
        })

    },
    lastProduct: async (req, res) => {
        const product = await db.Product.findOne({
            limit: 1,
            order: [["id", 'DESC']],
            include: ["category"]
        })

        res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/lastProduct"
            },
            data:
                    {
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.image,
                        stock: product.stock,
                        discount: product.discount,
                        category: product.category.title,
                        link: `http://localhost:3000/products/${product.category.id}/${product.id}`
                    }
        })
    },
    categories: async (req, res) => {
        const products = await db.Product.findAll();
        const categorys = await db.Category.findAll({ include: ["products"] })
        res.json({
            meta: {
                status: 200,
                totalProducts: products.length,
                link: "/api/dashboard/categories"
            },
            data:
                categorys.map(category => {
                    return {
                        total_products: category.products.length,
                        products: category
                    }
                })

        })

    },
    moreVisited: async (req, res) => {
        const moreVisited = await db.Visita.findAll();
        const moreVisitedTop10 = await db.Visita.findAll({
            limit: 10,
            order: [["numero", "DESC"]]
        });

        const products = await db.Product.findAll({
            where: {
                id: moreVisitedTop10.map( v => { return v.products_id })
            },attributes: ["id","name","category_id"]
        })

        const top10 = [];
        for(let n=0; n < moreVisitedTop10.length; n++) {
            products.map((product,i)=> {
                if(product.id === moreVisitedTop10[n].products_id){
                    top10.push({
                        visitaN: moreVisitedTop10[n].numero,
                        productsId: moreVisitedTop10[n].products_id,
                        category: product.category_id,
                        product: product.name,
                    })
                }
            })
        }

        res.json({
            meta: {
                status: 200,
                link: "/api/dashboard/morevisited"
            },
            data: {
                moreVisited: moreVisited.length,
                top10: top10
            }
        })
    },
    allProducts: async (req, res) => {
        const products = await db.Product.findAll ({include: ['category']});

    },
    category: async (req, res) => {
        const productByCategory = await db.Product.findAll({
            where: { category_id: req.params.categoryId}
        });
        let total = 0;
        productByCategory.map(product => {
            total = total + (Number(product.price) * Number(product.stock));
        })
        const category = await db.Category.findByPk(req.params.categoryId);

        res.json({
            meta: {
                status: 200,
                title: category.title,
                totalItems: productByCategory.length,
                totalPrice: total.toLocaleString(),
                link: `api/dashboard/category/${category.id}`
            },
            data: productByCategory.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price).toLocaleString(),
                    description: product.description,
                    image: product.image,
                    stock: product.stock,
                    discount: product.discount,
                    category: product.category,
                    page: `http://localhost:3000/products/${category.id}/${product.id}`,
                    link: `/api/product/${product.id}`
                }
            })
        })
    },
    promotions: async (req, res) => {
        const promotions = await db.Promotion.findAll();
        const products = await db.Product.findAll({
            where: {
                id: promotions.map(promo => { return promo.products_id })
            }, attributes: ["name"]
        })
        res.json({
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
    usersWithMessages: async (req, res) => {
        const users = await db.User.findAll();
        const messages = await db.Message.findAll({
            where: {
                users_id: users.map(user => { return user.id })
            }
        });
        const usersId = messages.map( m => { if(m.users_id != 1){ return m.users_id } })
        const uniqueUsersId = [...new Set(usersId)]
        const usersIdFiltered = uniqueUsersId.filter( user => { return user != undefined })
        const usersWithMessages = [];
        for(user of users){
            usersIdFiltered.map(id => {
                if(id == user.id){
                    usersWithMessages.push({
                        id: user.id,
                        name: user.first_name + " " + user.last_name,
                    })
                }
            })
        }

        res.json({
            meta:{
                status: 200,
                totalItems: usersWithMessages.length,
                link: 'api/dashboard/usersWithMessages'
            },
            data: usersWithMessages
        })
    },
    messages: async (req, res) => {
        const messages = await db.Message.findAll();
        const users = await db.User.findAll({
            where: {
                id: messages.map(m => m.users_id)
            }
        })
        const products = await db.Product.findAll();

        res.json({
            meta:{
                status: 200,
                totalItems: messages.length,
                users: users,
                link: 'api/dashboard/messages'
            },
            data: messages.map( message => {
                const product = products.filter(p => p.id == message.products_id);
                return {
                    id: message.id,
                    users_id: message.users_id,
                    to_id: message.to_id,
                    content: message.content,
                    products_id: message.products_id,
                    product: product[0],
                    from_name: message.from_name,
                    to_name: message.to_name,
                    date: message.date
                }
            })
        })
    },
    promotions_store: async (req, res) => {

        const errors = req.file.error;
        const promotion = req.body;

        promotion.image = req.file.filename;

        const newPromotion = await db.Promotion.create(promotion)

        if(errors){
            res.json({
                status: 200,
                create: "fail",
                errors: errors
            })
        } else {
            res.json({
                status: 200,
                create: "success",
            })
        }

    },
    newmessage: async (req, res) => {
        console.log(req.body)
        const newmessage = await db.Message.create(req.body);
        console.log(newmessage)
        res.json({
            status: 200,
            newmessage: newmessage
        })
    }
}

module.exports = controller;