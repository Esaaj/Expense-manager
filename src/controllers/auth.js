const User = require("../models/user");
const jsonwebtoken = require("jsonwebtoken");
JWT_SECRET = process.env.JWT_SECRET

function login(userDetails, callback) {
    let query = {
        email: userDetails.email
    };

    User.findOne(query, function (err, foundUser) {
        if (err) {
            callback(err, null);
            return;
        }

        if (foundUser.password == userDetails.password) {
            response = {
                token: jsonwebtoken.sign({ user: userDetails.email }, JWT_SECRET),
                msg: "Login Successful"
            }
            
            callback(null, response);
        } else {
            callback("Invalid Credentials", null);
        }
    });
}

module.exports.login = login;