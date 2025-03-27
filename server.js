import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import mongoose from 'mongoose';
import methodOverride from 'method-override';
const app = express();
import router from './controllers/auth.js';
import session from "express-session";







// Set the port from environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});



// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));
// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));
// Morgan for logging HTTP requests
app.use(morgan('dev'));
//sets the ejs engine for viewing
app.set("view engine", "ejs");



// configure session bassed Auth
app.use(
    session({
        secret: process.env.SESSIONS_SECRET,
        resave: false,
        saveUninitialized: true,
    })
)


app.get('/', (req, res) => {
    res.render('index', {
        user: req.session.user,
    });
})

//sets up the route for auth (Similar to what / to be the standard)
app.use('/auth',router)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
