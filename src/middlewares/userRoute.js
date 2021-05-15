const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersApiController = require("../controllers/api/usersApiController");
const remembermePath = path.join(__dirname, '../rememberme.json');

module.exports = async (req,res, next) => {
    const rememberme = await JSON.parse(fs.readFileSync(remembermePath,{encoding: 'utf-8'}));
    const rememberedUser = rememberme.find( user => user.token === req.body.token);

    if(rememberedUser){
        const [ , token ] = rememberedUser.token.split(' ');

        if(bcrypt.compareSync(token, rememberedUser.tokenhashed)){
            req.body.session = true;
            req.body.user = rememberedUser;

            return next();
        }
    }

    const tokens = usersApiController.tokens().tokens;

    const [ password, token ] = req.body.token ? req.body.token.split(' ') : [];

    if(!req.body.token || tokens.get(password) === undefined || !tokens.get(password).has(token)){
        return res.json({
            met: {
                status: 422
            },
            error: true,
            data: [{session: 'CSRF Token missing or expired'}]
        })
    } else {
        next();
    }

}