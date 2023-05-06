const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const middleware = require("../utils/middleware")

blogRouter.get('/', async (req, res) => {
    const blogs = await Blog.find({})
    res.json({
        message: "All blogs",
        status: "Success",
        blogs
    })
})
blogRouter.post('/create', middleware.authenticateToken, async (req, res) => {
    const {title, content, image, userId} = req.body
    const user = await User.findById({_id: userId})
    if (user.role === "user" || "admin") {
        const blog = new Blog({
            title,
            content,
            Image: image,
            user: user.id
        })
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        res.status(201).json({
            message: "Created blog successfully",
            status: "Created",
            savedBlog
        })
    }
})

module.exports = blogRouter