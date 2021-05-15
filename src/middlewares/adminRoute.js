// const usersApiController = require("../controllers/api/usersApiController");

// module.exports = (req,res, next) => {

//     const tokens = usersApiController.tokens().tokens;
//     const adminToken = usersApiController.tokens().adminToken[0];

//     const [ password, token ] = req.body.token ? req.body.token.split(' ') : [];

//     if(!req.body.token || !tokens.get(password) !== undefined || !tokens.get(password).has(token) || req.body.token !== adminToken){
//         return res.json({
//             met: {
//                 status: 422
//             },
//             error: true,
//             data: [{session: 'CSRF Token missing or expired'}]
//         })
//     } else {
//         next();
//     }

// }