const db = require('../../database/models');
const fs = require('fs');
const path = require('path');
const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const functions = require('../../functions/users');
const remembermePath = path.join(__dirname, '../../rememberme.json');
const { Op } = db.Sequelize;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: "rsmazzucco@gmail.com",
        pass: process.env.NODEMAILER_PASS,
    },
});

const tokens = new Map();
const adminToken = [];

const csrfToken = (pass) => {
    const token = uuid();

    tokens.get(pass).add(token);

    setTimeout (() => tokens.get(pass).delete(token), 1000 * 60 * 60 * 24);

    return token;
}

module.exports = {

    tokens: () => {
        return {tokens, adminToken};
    },

    index: async (req, res) => {

        const users = await db.User.findAll();

        return res.json({
            meta: {
                status: 200,
                totalItems: users.length,
                link: '/api/apiUsers'
            },
            data: users.map(user => {
                return {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    address: user.address,
                    city: user.city,
                    avatar: user.avatar,
                    status: user.status,
                    link: `/api/apiUsers/${user.id}`
                }
            })
        });
    },

    create: async (req, res) => {
        const errorsValidator = validationResult(req);
        let errors = errorsValidator.errors.filter( error => { return error.value != undefined })

        if(errors.length) {

            errors = errors.map( error => {
                return {
                    field: error.param,
                    message: error.msg
                }
             })

             return res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: errors
            })

        } else {

            req.body.password = bcrypt.hashSync(req.body.password, 10);
            req.body.avatar = req.file ? req.file.filename : "avatardefault.png";

            const user = await db.User.findOne({
                where: {
                    email: { [Op.like]: [req.body.email] },
                },
            })

            if(!user){
                try {
                    const newuser = await db.User.create(req.body);

                    tokens.set(newuser.dataValues.password, new Set());

                    const newtoken = csrfToken(newuser.dataValues.password);

                    newuser.dataValues.token = newuser.dataValues.password + " " + newtoken;

                    console.log(newuser)
                    return res.json({
                        meta: {
                            status: 200
                        },
                        data: {
                            user: newuser
                        }
                    })

                } catch (error) {
                    console.log(error)

                    return res.json({
                        meta: {
                            status: 500
                        },
                        error: true,
                        data: [{
                            field: 'modal',
                            message: 'Error de servidor, lo sentimos, intentelo mas tarde!'
                        }]
                    })
                }

            }

            res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: [{
                    field: "email",
                    message: "Ya existe un usuario con ese email!"
                }]
            })

        }
    },

    login: async(req, res) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()) {

            console.log(errors);

            errors = errors.errors.map( error => {
                return {
                    field: error.param,
                    message: error.msg
                }
            })

            return res.json({
                meta: {
                    status: 300,
                },
                error: true,
                data: errors
            })
        }

        const user = await db.User.findAll({
            where: {
                email: { [Op.like]: [req.body.email] },
            },
        });

        if(user[0]){

            if(!bcrypt.compareSync(req.body.password, user[0].password)){
                return res.json({
                    meta: {
                        status: 400
                    },
                    error: true,
                    data: [{
                        field: "password",
                        message: "La contraseña es Incorrecta"
                    }]
                })
            }

            tokens.set(user[0].password, new Set());

            const newtoken = csrfToken(user[0].password);

            user[0].dataValues.token = user[0].password + " " + newtoken;

            if(req.body.rememberme){
                const rememberme = JSON.parse(fs.readFileSync(remembermePath,{encoding: 'utf-8'}));

                user[0].dataValues.tokenhashed = bcrypt.hashSync(newtoken, 10)

                rememberme.push({ ...user[0].dataValues })

                fs.writeFileSync(remembermePath,JSON.stringify(rememberme, null, ' '));
            }

            if(user[0].status < 2){
                const username = user[0].first_name + ' ' + user[0].last_name;
                const { categorys, purchases, users, messages, orders} = await functions.getData(user[0].id, username);

                return res.json({
                    meta: {
                        status: 200
                    },
                    data: {
                        user: user[0],
                        categorys: categorys,
                        purchases: purchases,
                        users: users,
                        messages: messages,
                        orders: orders
                    }
                })
            } else {

                adminToken.push(user[0].dataValues.token);

                console.log("from login: ",user[0].dataValues.token)
                const {
                    categorys,
                    products,
                    users,
                    messages,
                    orderSuccess,
                    profits,
                    orderPending,
                    pending,
                    promotions
                } = await functions.getDataAdmin();

                return res.json({
                    meta: {
                        status: 200
                    },
                    data: {
                        user: user[0],
                        categorys: categorys,
                        products: products,
                        users: users,
                        messages: messages,
                        orderSuccess: orderSuccess,
                        profits: profits,
                        orderPending: orderPending,
                        pending: pending,
                        promotions: promotions
                    }
                })
            }
        }

        if(!user[0]){
            res.json({
                meta: {
                    status: 400
                },
                error: true,
                data: [{
                    field: "email",
                    message: "El usuario no es correcto"
                }]
            })
        }
    },

    session: async (req, res) => {

        if(req.body.session){

            const username = req.body.user.first_name + ' ' + req.body.user.last_name;
            const { categorys, purchases, users, messages, orders } = await functions.getData(req.body.user.id, username);

            return res.json({
                meta: {
                    status: 200
                },
                data: {
                    user: req.body.user,
                    categorys: categorys,
                    purchases: purchases,
                    users: users,
                    messages: messages,
                    orders: orders
                }
            })

        }

        const [ password, token ] = req.body.token.split(' ');

        if(!req.body.token || !tokens.get(password).has(token)){
            return res.json({
                met: {
                    status: 422
                },
                error: true,
                data: ['CSRF Token missing or expired - from LOGIN']
            })
        }

        const user = await db.User.findAll({
            where: {
                password: { [Op.like]: [password] },
            },
        });

        const username = user[0].first_name + ' ' + user[0].last_name;
        const { categorys, purchases, users, messages, orders } = await functions.getData(user[0].id, username);

        return res.json({
            meta: {
                status: 200
            },
            data: {
                user: user[0],
                categorys: categorys,
                purchases: purchases,
                users: users,
                messages: messages,
                orders: orders
            }
        })

    },

    savesession: (req, res) => {
        const rememberme = JSON.parse(fs.readFileSync(remembermePath,{encoding: 'utf-8'}));

        const updatesession = rememberme.filter( user => user.email !== req.body.email);

        if(!updatesession.some( user => user === req.body.user )){
            delete req.body.user
            updatesession.push(req.body)
        } else {
            console.log('no elimino los datos de la session anterior')
        }

        fs.writeFileSync(remembermePath,JSON.stringify(updatesession, null, ' '));

    },

    profile: async (req, res) => {
        const user = await db.User.findByPk(Number(req.params.id));
        const username = user.dataValues.first_name + ' ' + user.dataValues.last_name;

        const { categorys, purchases, users, messages, orders} = await functions.getData(user.dataValues.id, username);

        return res.json({
            meta: {
                status: 200
            },
            data: {
                user: user[0],
                categorys: categorys,
                purchases: purchases,
                users: users,
                messages: messages,
                orders: orders
            }
        })

    },

    logout: async (req, res) => {

        const rememberme = await JSON.parse(fs.readFileSync(remembermePath,{encoding: 'utf-8'}));

        if(req.body.session){

            const rememberedUserDeleted = rememberme.filter( user => user.tokenhashed !== req.body.user.tokenhashed)

            fs.writeFileSync(remembermePath,JSON.stringify(rememberedUserDeleted, null, ' '));

            if(rememberedUserDeleted.some( user => user.tokenhashed === req.body.user.tokenhashed)){
                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    data: [{ message: 'La cookie no se ha podido eliminar'}]
                })
            } else {
                return res.json({
                    meta: {
                        status: 200
                    },
                    logout: true,
                    data: 'La cookie fue eliminada.'
                })
            }

        }

    },

    changepassword: async (req, res) => {

        const user = await db.User.findOne({
            where: {
                email: req.body.email
            }
        })

        if(bcrypt.compareSync(req.body.password, user.password)){
            try {
                req.body.password = bcrypt.hashSync(req.body.newpassword, 10);

                delete req.body.newpassword;

                await db.User.update(req.body, {
                    where: {
                        email: req.body.email
                    }
                })

                const updateduser = await db.User.findOne({
                    where: {
                        email: req.body.email
                    }
                })

                tokens.set(updateduser.password, new Set());

                const newtoken = csrfToken(updateduser.password);

                updateduser.token = updateduser.password + " " + newtoken;

                return res.json({
                    meta: {
                        status: 200
                    },
                    data: {
                        updateduser: updateduser
                    }
                })

            } catch (error) {

                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    data: [{
                        field: 'changepassword',
                        message: 'Lo sentimos, no se ha podido actualizar la contraseña!'
                    }]
                })
            }
        } else {
            return res.json({
                meta: {
                    status: 300
                },
                error: true,
                data: [{
                    field: 'currentpassword',
                    message: 'La contraseña actual no es correcta.'
                }]
            })
        }

    },

    update: async (req, res) => {

        const user = await db.User.findByPk(req.body.id);
        const errorsValidator = validationResult(req);

        let errors = errorsValidator.errors.filter( error => error.value !== undefined );

        if(errors.length) {

            console.log(errors);

            errors = errors.map( error => {
                return {
                    field: error.param,
                    message: error.msg
                }
            })

            return res.json({
                meta: {
                    status: 300,
                },
                error: true,
                data: errors
            })
        }

        if(bcrypt.compareSync(req.body.password, user.password)){

            try {
                delete req.body.password;

                await db.User.update(req.body, {
                    where: { id: user.id }
                });

                const updateduser = await db.User.findOne({
                    where: {
                        email: req.body.email
                    }
                })

                return res.json({
                    meta: {
                        status: 200
                    },
                    modal: true,
                    data: {
                        updateduser: updateduser
                    }
                })

            } catch (error) {

                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    data: [{
                        field: 'datauser',
                        message: 'Lo sentimos, no se ha podido actualizar la informacion!'
                    }]
                })

            }
        }

        return res.json({
            meta: {
                status: 400
            },
            error: true,
            data: [{
                field: 'password',
                message: 'Contraseña Incorrecta'
            }]
        })

    },

    newavatar: async (req, res) => {

        const errors = validationResult(req).errors;

        if(errors.length){

            return res.json({
                meta: {
                    status: 400
                },
                error: true,
                modal: true,
                data: {
                    field: 'newavatar',
                    message: errors[0].msg
                }
            })

        } else {

            try {
                const user = await db.User.findOne({
                    where: {
                        id: Object.values(req.body)
                    }
                })

                if(user.avatar !== 'avatardefault.png'){
                    fs.unlinkSync(path.join(__dirname,"../../../public/images/" + user.avatar));
                }

                const saveavatar = {...user, avatar: req.file.filename}

                await db.User.update(saveavatar, {
                    where: { id: user.id }
                });

                const updateduser = await db.User.findOne({
                    where: {
                        id: Object.values(req.body)
                    }
                })

                return res.json({
                    meta: {
                        status: 200
                    },
                    data: {
                        updateduser: updateduser
                    }
                })
            } catch (error) {

                console.log(error)

                return res.json({
                    meta: {
                        status: 500
                    },
                    error: true,
                    modal: true,
                    data: [{
                        field: 'newavatar',
                        message: 'No se ha podido actualizar la informacion!'
                    }]
                })
            }
        }

    },

    delete: async (req, res) => {

        const [ password, token ] = req.body.token;

        try {
            const user =  await db.User.delete({
                where: {
                    password: password
                }
            })

            await user.destroy();

            return res.json({
                meta: {
                    status: 200
                },
                data: user[0]
            })

        } catch (error) {

            return res.json({
                meta: {
                    status: 500
                },
                error: true,
                data: [{
                    field: 'modal',
                    message: 'Lo sentimos no se ha podido eliminar el usuario!'
                }]
            })

        }
    },

    messages: async (req, res) => {

        try {
            var f = new Date();

            const date = (f.getDate() + " / " + (f.getMonth() + 1) + " / " + f.getFullYear() + "  -  " + f.getHours() + ":" + f.getMinutes() + ":" + f.getSeconds());

            delete req.body.token;

            const message = req.body;

            message.date = date;

            console.log(message)

            const newmessage = await db.Message.create(message);

            return res.json({
                meta: {
                    status: 200
                },
                message: true,
                data: newmessage
            })

        } catch (error) {

            return res.json({
                meta: {
                    status: 500
                },
                error: true,
                data: [{
                    field: 'modal',
                    message: 'Lo sentimos no se ha podido enviar el mensaje'
                }]
            })

        }
    },

    email: async (req, res) => {

        const urlbaseapi = process.env.URL_API_DEV;
        const urlbaseapp = process.env.URL_APP_DEV;

        const presentationcard = `<p>${req.body.message}</p><div style='margin-top: 100px;width: 550px;padding: 32px;box-shadow: 3px 3px 3px 1px rgba(0,0,0,0.3);display: flex;flex-direction: row;background-color: #FF6C00;filter: sepia(30%)'>
            <div style='width: 150px;filter: drop-shadow(3px 3px 1px rgba(0,0,0,0.3))'>
                <img src=${urlbaseapi}/images/logo.png alt="e-commerce" width='150px'/>
            </div>
            <div style='width: 400px;border-left: 1px solid #9f4400'>
                <ul style='list-style: none;line-height: 32px;color: #9f4400'>
                    <li><a href=${urlbaseapp}>${urlbaseapp}</a></li>
                    <li>info@tumarca_e-commerce.com.ar</li>
                    <li>Callle Falsa 123, Spriengfield</li>
                    <li>0341-4339666</li>
                </ul>
            </div>
        </div>`

        async function main(){

            const info = await transporter.sendMail({
                sender: req.body.email,
                replyTo: req.body.email,
                to: `<ramazzucco@hotmail.com>`,
                subject: req.body.subject,
                html: presentationcard
            });

            console.log("Message sent: %s", info.messageId);

            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info;
        }

        const sendEmail = await main().catch(error => { return error });

        console.log(sendEmail)

        if(sendEmail.response.includes('OK')){
            return res.json({
                meta: {
                    status: 200
                },
                data: sendEmail
            })
        } else {
            return res.json({
                meta: {
                    status: 500
                },
                error: true,
                data: sendEmail
            })
        }

    }
}