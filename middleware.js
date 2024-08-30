
const ExpressError = require("./utils/ExpressError.js");

module.exports.isAuthenticated = (req, res, next) => {
    if(!req.isAuthenticated()){
        console.log("you must be logged in")
        //if user is not logged in save original URL
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}