const db = require("../../database/models");
const functions = require('../../functions/products');
const fs = require("fs");
const path = require("path");
const mercadopago = require("mercadopago");
const { Op } = db.Sequelize;

mercadopago.configure({
    access_token: process.env.MP_CREDENTIALS_DEV,
});

const controller = {
    store: async (req, res) => {
        req.body.category_id = Number(req.body.category_id);
        req.body.price = Number(req.body.price);
        req.body.stock = Number(req.body.stock);
        req.body.discount = Number(req.body.discount);
        req.body.image = req.file ? req.file.filename : req.body.image
        const product = [req.body]

        const category = await db.Category.findByPk(product.category_id)

        if(product.length){
            await db.Product.create(product[0])

            res.json({
                status: 200,
                error: false,
                msg: "Producto creado",
                categoryName: category
            })
        } else {
            res.json({
                status: 404,
                error: true,
                msg: "El Producto no se pudo crear"
            })
        }
        console.log(product, req.file)
    },
    index: async (req, res) => {
        const visit_page = await Number(req.cookies.visit_page);

        const products = await db.Product.findAll({
            include: ['category'],
            order: ["price"]
        });

        const categorys = await db.Category.findAll();

        const visitasId = await db.Visita.findAll({
            where: {
                numero: {
                    [Op.gt]: 2
                }
            }, attributes: ["products_id"]
        });
        const masVisitados = await db.Product.findAll({
            where:{
                id: visitasId.map( visita => { return visita.products_id })
            }
        });

        const promotions = await db.Promotion.findAll();

        const messages = await db.Message.findAll();

        const views = await db.Visita.findAll();

        res.json({
            meta: {
                status: 200,
                totalItems: products.length,
                visit_page: visit_page
            },
            data: {
                categories: categorys.map( category => {
                    return { id: category.id, name: category.title }
                }),
                allproducts: products.map(product => {
                    return {
                        id: product.id,
                        marca: product.marca,
                        name: product.name,
                        price: product.price,
                        description: product.description,
                        image: product.image,
                        stock: product.stock,
                        discount: product.discount,
                        category_id: product.category.id,
                        category_title: product.category.title,
                        link: `http://localhost:3000/products/${product.category_id}/${product.id}`
                    }
                }),
                views: views,
                morevisited: masVisitados,
                promotions: promotions,
                messages: messages
            }
        });
    },
    show: async (req, res, next) => {

        try {
            const product = await db.Product.findByPk(req.params.id, {
                include: ['category']
            });

            const categorys = await db.Category.findAll();

            const response = product ? {
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                image: product.image,
                stock: product.stock,
                discount: product.discount,
                category: product.category,
                link: `/api/product/${product.id}`,
                categorys: categorys
            } : ''

            const error = {
                error: true,
                message: 'No se encuentra el producto solicitado'
            }

            res.json({
                meta: {
                    status: 200,
                    link: '/api/product/' + req.params.id
                },
                data: product ? response : error
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
    update: async (req, res) => {
        const newproduct = [req.body];
        const product = await db.Product.findByPk(req.params.id);
        newproduct[0].image = product.image;

        if(newproduct.length){
            await db.Product.update(newproduct[0], {
                where: {
                    id: req.params.id
                }
            })

            res.json({
                status: 200,
                error: false,
                msg: "Producto Actualizado"
            })
        } else {
            res.json({
                status: 404,
                error: true,
                msg: "El Producto no se pudo actualizar"
            })
        }
    },
    delete: async (req, res) => {
        const ids = req.params.id.split(",")

        const product = await db.Product.findAll({
            where:{
                id: ids
            }
        })

        product.map(p => {
            if(p.image != "sin_imagen.jpg"){
                fs.unlinkSync(path.join(__dirname,`../../../public/images/${p.image}`))
            }
        })
        const productDeleted = await db.Product.destroy({ where: { id: ids } });
        console.log("PRODUCTO ELIMINADO: ",productDeleted)
        const newProducts = await db.Product.findAll({
            where:{
                category_id: product[0].category_id
            }
        })
        console.log(newProducts)
        res.json({
            status: 200,
            msg: `El producto "${product.name}" fue eliminado`,
            products: newProducts
        })
    },
    search: async (req, res) =>{

        try {
            const product = await db.Product.findOne({
                where: {
                    name: req.query.search
                }
            });

            if(product){
                return res.json({
                    meta: {
                        status: 200
                    },
                    data: product
                })
            } else {
                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    data: {
                        field: 'search',
                        message: 'Lo sentimos no se ha encontrado ningun producto.'
                    }
                })
            }

        } catch (error) {
            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: {
                    field: 'search',
                    message: error
                }
            })
        }
    },
    orderby: async (req, res) => {

        const category = req.query.category;
        const orderby = req.query.orderby;
        const direction = req.query.direction;
        const min = req.query.min ? Number(req.query.min) : false;
        const max = req.query.max ? Number(req.query.max) : false;

        console.log('hay min?',min ? min : false,'hay max?',max ? max : false)

        try {

            const products = await functions.orderBy(category,orderby,direction,min,max);

            if(products.length){
                res.json({
                    meta: {
                        status: 200
                    },
                    data: products
                })
            } else {
                res.json({
                    meta: {
                        status: 400
                    },
                    error: true,
                    data: {
                        message: 'No se encontraron productos con esos paramatros de busqueda!',
                    }
                })
            }


        } catch (error) {
            console.log('ERROR EN BASE DE DATOS: ',error)

            res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: {
                    message: 'No se encontraron productos con esos paramatros de busqueda!',
                    dbmessage: error.original.sqlMessage
                }
            })

        }
    },
    checkout: async (req, res) => {

        //Obtengo los productos y sus datos.
        const id = req.body.id;
        const userEmail = req.body.user.email;

        const productselected = await db.Product.findAll({
            where: { id: id },
        });
        const productQuantity = req.body.quantity;

        //Armo los productos para pasarlos a los items que require mercadopago.
        const products = productselected.map((product, i) => {
            const priceWithDiscount = (Number(product.price) - ((Number(product.price) * product.discount) / 100));
            return {
                id: product.id,
                name: product.name,
                quantity: Number(productQuantity),
                price: priceWithDiscount,
                discount: product.discount,
                priceWithoutDiscount: product.price,
                image: product.image
            }
        });

        //   Creo la orden.
        var f=new Date();
        const date = (f.getDate() + " / " + f.getMonth() + " / " + f.getFullYear()
         + "  -  " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds());

        const lastItem = await db.Item.findOne({
            limit: 1,
            order: [["id", "DESC"]],
        });
        const itemId = lastItem.id + 1;

        const lastOrderId = await db.Order.findOne({
            limit: 1,
            order: [["id", "DESC"]],
        });
        const orderId = lastOrderId.id + 1;

        // Creo los items por cada producto.
        products.forEach((product,i) => {
            const price = product.price * product.quantity
            db.Item.create({
                products_id: product.id,
                orders_id: orderId,
                price: price,
                quantity: product.quantity,
                name: product.name,
                discount: product.discount,
                priceWithoutDiscount: product.price,
                image: product.image
            });
        });

        db.Order.create({
            items_id: itemId,
            users_id: req.body.user.id,
            number: orderId,
            status:"pending",
            date: date
        });

        const generateMercadoPagoItemFromProduct = (product) => {
            return {
                title: product.name,
                quantity: product.quantity,
                currency_id: "ARS",
                unit_price: product.price,
            }
        };

        const mercadoPagoProducts = products.map(p => generateMercadoPagoItemFromProduct(p)) ;

        console.log(mercadoPagoProducts)

        const mercadoPagoPreferenceStructure = generatePreferenceStructure(
            mercadoPagoProducts,
            userEmail,
            orderId
        );

        const mercadoPagoPreferency = await mercadopago.preferences.create(
            mercadoPagoPreferenceStructure
        );

        return res.json({
            meta: {
                status: 200
            },
            data: {
                redirect: mercadoPagoPreferency.response.init_point
            }
        });
    },

    successPayment: async (req, res) => {
        const lastOrderId = await db.Order.findOne({
            limit: 1,
            order: [["id", "DESC"]],
        });

        console.log(req.query)

        lastOrderId.status = "success";

        const updateOrder = await db.Order.update(lastOrderId.dataValues,{
            where: {
                id: lastOrderId.id
            }
        })

        return res.json({
            meta:{
                status: 200
            },
            data: updateOrder
        })
    },

    failedPayment: (req, res) => {
        // res.redirect(`/product/cart`);
        res.redirect('http://localhost:5000/page');
    },

};

const generatePreferenceStructure = (mercadoPagoProducts,userEmail,orderId) => {
    return {
        items: mercadoPagoProducts,
        payment_methods: {
            excluded_payment_types: [
                {
                    id: "ticket",
                },
                {
                    id: "atm",
                },
            ],
        },
        external_reference: String(orderId),
        binary_mode: true,
        auto_return: "all",
        back_urls: {
            pending: "http://localhost:3000/api/product/proccess/",
            failure: "http://localhost:3000/api/product/paymentdeclined",
            success: "http://localhost:3000/api/product/successfulpayment",
        },
        payer: {
            email: userEmail,
        },
        shipments: {
            cost: 50,
            mode: "not_specified",
        },
    };
};

module.exports = controller;