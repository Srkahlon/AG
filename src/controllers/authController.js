const User = require('../models').User;
const globals = require('../config/globals');
var jwt = require('jsonwebtoken');

//AuthController checks the incoming headers,token if its present in the header and is valid.
module.exports.AuthController = class AuthController {

    //Check if the authorization header is present and its correct.
    checkHeaders(req,res,next)
    {
        var headers = req.headers;
        if(headers.hasOwnProperty("authorization") && headers.authorization == globals.authorization)
        {
            next();
        }
        else
        {
            res.status(401).send({'message':globals.auth_header_missing});
        }
    }

    //Check if token is present and its correct
    verifyToken(req,res,next)
    {
        var headers = req.headers;
        //Check if header exists
        if(headers.hasOwnProperty("x-access-token"))
        {
            var token = headers["x-access-token"];
            //Verify the token.
            jwt.verify(token, globals.secret, function(err, decoded) {
                if(err)
                {
                    res.status(500).send({'message': globals.invalid_token});
                }
                else
                {
                    //Check if user exists with that id and email id.
                    User.findOne({where: {id: decoded.id,email_id: decoded.email_id}})
                    .then((user) => {
                        //If user is found, call the next action.
                        if(user)
                        {
                            next();
                        }
                        //Invalid token
                        else
                        {
                            res.status(500).send({'message': globals.invalid_token});
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            success: 0,
                            message : globals.general_exception
                        });
                    });
                }
            });
        }
        //No header present, send 401
        else
        {
            res.status(401).send({'message': globals.missing_token});
        }
    }
};