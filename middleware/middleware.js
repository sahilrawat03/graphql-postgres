const jwt = require("jsonwebtoken");
const secret = process.env.SECRET|| '12345678';

const middleware={}
middleware.authenticateUser = (req, res) => {
    try {
        
        let tokenData = jwt.verify(req.headers.authorization, secret);
        return tokenData;
   
    }
    catch(err) {
        return ;
    }
};

module.exports =  middleware ;