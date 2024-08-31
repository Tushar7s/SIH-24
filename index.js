const express = require('express');
const bodyParser = require('body-parser');
const session = require("express-session");
const methodOverride = require('method-override');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const mongoose = require('mongoose');
const http = require("http");
const socketio = require("socket.io");

// Setup server and socket.io
const server = http.createServer(app);
const io = socketio(server);

// Models
const Admin = require("./models/admin.js");

// Routes
const adminRouter = require("./routes/admin.js");
const hospitalRouter = require("./routes/hospital.js");
const appointmentRouter = require("./routes/appointment.js");
// Database connection
mongoose.connect("mongodb://127.0.0.1:27017/SIH")
    .then(() => console.log("Connection successful"))
    .catch((error) => console.log(error));

// App setup
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.engine("ejs", ejsMate);

app.use(session({
    secret: 'process.env.SECRET',
    resave: false,
    saveUninitialized: true,
    cookie: {expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,}
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// Socket.io setup
io.on("connection", function(socket) {
    socket.on("send-location", function(data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });

    socket.on("disconnect", function() {
        io.emit("user-disconnected", socket.id);
    });
});

app.use((req, res, next) => {
    // res.locals.success = req.flash("success");
    // res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });
// Routes
app.use('/', adminRouter);
app.use('/', hospitalRouter);
app.use("/", appointmentRouter);




// Start the server
const port = 8080;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
