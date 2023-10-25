// let data = require("../database/user.json");
const secret = process.env.SECRET|| '12345678';
const jwt = require("jsonwebtoken");

// const { newIndex } = require("./sidefunction");
const { request, response } = require("express");
const pool=require('../database/db')

const userController = {};

// finds the matching mail with data
let userMail = (tokenid) => data.find((i) => i.mail == tokenid);

// finds the matching password with data
let userPassword = (tokenid) => data.find((i) => i.password == tokenid);


userController.createUser = async(request, response) => {
    try {
      const { name,username, email,password,contactNo } = request.body;
      const { rows } = await pool.query('INSERT INTO users(name,username, email,password,contactNo) VALUES($1, $2, $3, $4, $5) RETURNING *', [name,username, email,password,contactNo]);
      let token = jwt.sign({ id: rows[0].id, role:rows[0].role }, secret, { expiresIn: "3h" });

        response.status(201).json({token});
    } catch (error) {
      console.error(error.message); 
      response.status(500).json({ error: 'Internal Server Error' });
    }
};


userController.verifyUser = async(request, response) => {
    try {
      const { username,password } = request.body;
        const { rows } = await pool.query(`SELECT * from users where username=$1 AND password =$2 LIMIT 1`,[username,password]);
      let token = jwt.sign({ id: rows[0].id }, secret, { expiresIn: "3h" });

        response.status(201).json({token});
    } catch (error) {
      console.error(error.message); 
      response.status(500).json({ error: 'Internal Server Error' });
    }
};
userController.updateUser = async(request, response) => {
    try {
        function generateUpdateClause(request) {
            const updates = Object.keys(request).filter(key => key !== 'id').map(key => {
                return `${key} = '${request[key]}'`;
            });
            return updates.join(', ');
        }
        
        // Construct the update query
        const updateClause = generateUpdateClause(request.body);
        // const { name, username, email, password, contactNo } = request.body;/
        let query = `Update Users set ${updateClause} where id=${request.body.id}`;

      const { rows } = await pool.query(query );
        response.status(201).json({message:"data updated successfully",data: rows[0]});
    } catch (error) {
      console.error(error.message); 
      response.status(500).json({ error: 'Internal Server Error' });
    }
};


userController.updateTutorial = (request, response) => {
 
    // const keys = Object.keys(request.body); // Get the keys from req.body
    // const values = Object.values(request.body);
    // console.log(keys,values);
    let query = "update tutorials set ";
    let bind = [];
    let count = 1;
    if (request.body.id) {
         bind.push(request.body.id);
        count++;
    }
     if (request.body.title || request.body.description || request.body.published) {
         for (let key in request.body) {
             if (key=='id') {
                 continue;
             }
             query += `${key}=$${count}, `;
             bind.push(request.body[key]);

             count++;
             
            // query2.concat(key+"=" +request.body[key] +"," );
            // console.log(key, request.body[key],query2,'=================');
         }
         query = query.slice(0, -2);

     }
    
    if (request.body.id) {
        query += " WHERE id = $1";
    }
    pool.query(query, bind, (err, result) => {
        if (err) {
            throw err;
        }
        response.status(200).json(result.rows);
    })
    
};

userController.getTutorials =  (request, response) => {
    let query = "SELECT * FROM tutorials";

    if (request.body.id) {
        query += " WHERE id = $1";
    }

    pool.query(query,request.body.id?[request.body.id]:[] ,(error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const randomNumber =async () => {
    let unique = 1;
    let randomThreeDigitNumber;
    while (unique) {   
        randomThreeDigitNumber = Math.floor(Math.random() * 9000) + 1000;
        let ans = await pool.query("select title from tutorials where id=$1", [randomThreeDigitNumber],
        );
        if (ans.rowCount==0) {
            unique = 0;
        }
        
    }
    return randomThreeDigitNumber;
};
userController.createTutorial = async(request, response) => {
    const time = new Date();
    // console.log(time,request.body); 
    const { title, description, published } = request.body;
    let t = title;
    let randomThreeDigitNumber =await randomNumber();
    pool.query("INSERT INTO tutorials VALUES ($1, $2, $3 ,$4, $5,$6) RETURNING *", [randomThreeDigitNumber,t, description,published,time,time], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
};

userController.deleteTutorial = (request, response) => {
    pool.query(`delete from  tutorials where id =$1`, [request.body.id], (error, result) => {
        if (error) {
            throw error;
        }
        response.status(200).json('deleted successfully');
    } )
}

userController.signUp = (req, res) => {
    //gets object from id
    let checkEmail = userMail(req.body.mail);

    if (checkEmail) {
        res.status(400).send(" user already existed");
    } else {
        //assigning index to new user
        req.body.id = newIndex();
        data.push(req.body);
        let token = jwt.sign({ id: req.body.id }, secret, { expiresIn: "3h" });
        let obj = new Object;
        obj.token = token;
        tokenPush(obj);
        fsPush(data);
     
        res.status(200).send(JSON.stringify({ token }));

    }
};

const signIn = (req, res) => {
    let checkEmail = userMail(req.body.mail);
    let checkPassword = userPassword(req.body.password);

    if (!checkEmail || !checkPassword) {
        res.status(400).send(" signup first");
    } else {
        if (checkEmail.id != checkPassword.id) {
            res.status(404).send("invalid");
        }

        else {

            let token = jwt.sign({ id: checkEmail.id }, secret, { expiresIn: "3h" });
            let obj = new Object;
            obj.token = token;
            tokenPush(obj);
            res.status(200).send(JSON.stringify({ token }));
        }

    }
};

module.exports = { userController};
