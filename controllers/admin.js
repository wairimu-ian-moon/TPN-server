const adminRouter = require("express").Router()
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const config = require("../utils/config")

adminRouter.post("/", async (req, res) => {
    const {username, email, password} = req.body
    let role = ""
    if (req.baseUrl === "/api/admin") {
        role = "admin"
    }
    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)
    const admin = new User({
        username,
        email,
        passwordHash,
        role
    })
    const savedAdmin = await admin.save()

    res.status(201).json(savedAdmin)
})

adminRouter.post("/login", async(req, res) => {
    const {username, password} = req.body
    const admin = await User.findOne({username})
    if (admin.role === "admin") {
        const passwordCorrect = await bcrypt.compare(password, admin.passwordHash)
        if (!passwordCorrect) {
            res.status(401).json({
                error: 'incorrect password try again'
            })
        }
        const adminToken = {
            username: admin.username,
            id: admin._id
        }
        const token = jwt.sign(adminToken, config.ADMIN_SECRET, {expiresIn: 60 * 60})

        res.status(200).send({token, username: admin.username, role: admin.role})
    }else {
        res.status(401).json({
            message: "you don't have the correct credentials to access the site"
        })
    }
})

module.exports = adminRouter