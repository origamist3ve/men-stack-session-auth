import {Router} from 'express';
const router = Router()
import User from "../models/user.js"
import bcrypt from "bcrypt"





router.get("/sign-up", (req, res) => {
    res.render("auth/signup")
})

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in")
})

router.post("/sign-in", async(req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    )
    console.log("valid password",validPassword)

    req.session.user = {
        _id: userInDatabase._id,
        username: userInDatabase.username,
    }

    res.redirect("/")
})


router.post("/sign-up", async(req, res) => {
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Passwords don't match");
    }
    const userInDB = await User.findOne({username: req.body.username})
    if (userInDB) {
        return res.send("Authentication Failed");
    }

    // Hashing plain text password before saving to db
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user = await User.create({
        username: req.body.username,
        password: hashedPassword,
    })

    res.send(`Thanks for signing up! ${user.username}`)
})





export default router;