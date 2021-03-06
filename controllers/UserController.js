var jwt = require("jsonwebtoken");
var mysql = require('mysql')
var bcrypt = require('bcrypt-nodejs')
var models  = require('../models');

module.exports = class UserController {
    constructor(req, res){
        this._req = req;
        this._res = res;
    }

    async authenticate(){
        var email = this._req.body.email;
        var password = this._req.body.password;
        
        try {
            const data = await models.User.findOne({
                where: {
                    email: email,
                }           
            });
            if(data){
                var hash = bcrypt.hashSync(data.password);
                var isAuthenticated =  bcrypt.compareSync(password, hash);
                if(isAuthenticated){
                    var user = ({
                        email: email,
                        password: password
                    })
    
                    var token = jwt.sign(user, process.env.SECRET_KEY, {
                        expiresIn: 400000
                    });
    
                    this._verifyToken(token);

                    this._res.json({
                        token: token
                    });
                }
            }
        } catch(err) {
            console.log(err);
        }    
    } 

    _verifyToken(token){
        jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
            if(err){
                console.log('err' + err)
            } else{
                console.log('token valido');
            }
        })
    }
}