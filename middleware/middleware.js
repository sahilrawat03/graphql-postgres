const jwt = require("jsonwebtoken");
const secret = process.env.SECRET|| '12345678';

const middleware={}
middleware.authenticateUser = (req, res) => {
    //  console.log(req.headers.authorization,'==========')
    try {
        
        let tokenData = jwt.verify(req.headers.authorization, secret);
        return tokenData;
   
    }
    catch(err) {
        console.log(err.message,'=============================')
        res.send(tokenError);
    }
};

module.exports =  middleware ;