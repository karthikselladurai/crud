const jwt = require('jsonwebtoken');
const jwtconfig = require('../config/jwt/jwt_config')

//check token
exports.function_check_token = function (req, res, next) {
    var token = req.get('Authorization');
    console.log(token)
    if (token) {
        token = token.slice(7);
        jwt.verify(token, jwtconfig.secret, (err, decoded) => {
            //res.json({massage:"access granded"})
            if (err) {
                res.status(400).json({ massage: "invalid token" })
                console.log(err)
            } else {
                next()
            }
        });
    } else {
        res.status(400).json({ massage: "access denide" })

    }
}