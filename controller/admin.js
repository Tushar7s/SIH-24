const Admin = require("../models/admin.js");

module.exports.getLoginForm = async(req, res) => {
    res.render("admin/login.ejs");
}
module.exports.getSignUpForm = async(req,res) => {
    res.render("admin/signup.ejs");
}

module.exports.registerAdmin = async(req, res) => {
    console.log(req.body);
    let{id, username, email, password} = req.body;
    const newAdmin = new Admin({id, email, username});
    const registeredAdmin = await Admin.register(newAdmin, password);

    req.login(registeredAdmin, (err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/map");
    })
}
module.exports.loginUser = async (req, res) => {
    console.log("login");
    if (res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);
    }else {
        res.redirect("/map");
    }
}

module.exports.logoutUser = async(req, res) => {
    req.logout(function(err){
        if(err) {return next(err);}
        res.redirect("/");
    });
}