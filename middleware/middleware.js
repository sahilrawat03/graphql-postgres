const jwt = require("jsonwebtoken");
const secret = process.env.SECRET|| '12345678';

const middleware={}
 middleware.authenticateUser = (req, res, next) => {
    try {
        
        tokenData = jwt.verify(req.headers.token, secret);
        req.body = tokenData;
        next();
    }
    catch {
        res.send(tokenError);
    }
};

module.exports =  middleware ;