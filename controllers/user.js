const userRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const config = require("../utils/config");
const middleware = require("../utils/middleware")

userRouter.get('/', middleware.authenticateToken , async (req, res) => {
    const users = await User.find({}).populate("blogs")
    console.log(users.blogs)
    res.send(users)
})
userRouter.post("/", async (req, res) => {
    const {username, email, password} = req.body
    let role = ""
    const saltRound = 10
    if (req.baseUrl === "/api/users") {
        role = "user"
    }
    const passwordHash = await bcrypt.hash(password, saltRound)
    const user = new User({
        username,
        email,
        passwordHash,
        role
    })
    const savedUser = await user.save()

    res.status(201).json(savedUser)
})

userRouter.post("/login", async (req, res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})
    if (user.role === "user" || "admin") {
        const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: "invalid email and password"
            })
        }
        const userToken = {
            username: user.username,
            id: user._id,
        }
        const token = jwt.sign(userToken, config.SECRET, {expiresIn: 60 * 60})

        res.status(200).json({
            message: "SignIn success",
            status: "success",
            data: {
                token,
                username: user.username,
                role: user.role,
                userId: user._id
            }
        })
    }else {
        res.status(401).json({
            message: "register for an account in order to login into this site"
        })
    }
})

userRouter.get("/logout", middleware.authenticateToken, (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if(err) {
                res.status(400).json({message: "unable to logout"})
            } else {
                res.json({message: "Logout Success"})
            }
        })
    }
    res.redirect('/')
})

// userRouter.patch('/forgot-password', middleware.authenticateToken, async (req, res) => {
//     const {email} = req.body
//     const user = User.findOne({email})
//
// })
userRouter.patch("/update/:id/profile", middleware.authenticateToken, async (req, res) => {
    const {id} = req.params
    const user = await User.findOne({_id: id})
    const options = {new: true}
    if (user.role === "user" || "admin") {
        const {username, email} = req.body
        const updatedUser = await User.findByIdAndUpdate(id, {username, email, updatedAt: new Date().toLocaleDateString()}, options)
        res.status(200).json({
            message: "Successfully updated your details",
            status: "Success",
            updatedUser
        })
    }
})
userRouter.patch("/update/:id/password", async (req, res) => {
    const {password} = req.body
    const {id} = req.params
    const decodedToken = jwt.verify(middleware.getTokenFrom(req), config.SECRET)
    if(decodedToken.id !== id) {
        return res.status(401).json({error: "invalid token"})
    }
    const user = await User.findById({_id: decodedToken.id})
    if (user.role === "user" || "admin") {
        const saltRound = 10
        const passwordHash = await bcrypt.hash(password, saltRound)
        await User.findByIdAndUpdate(decodedToken.id, {passwordHash, updatedAt: new Date().toLocaleDateString()}, {new: true})
        res.status(200).json({
            message: "Password Successfully updated",
            Status: "Success"
        })
    }
})

module.exports =  userRouter