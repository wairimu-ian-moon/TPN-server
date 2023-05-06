const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const logger = require("./utils/logger")
const morgan = require("morgan")
const cors = require("cors")
const config = require("./utils/config")
const app = express()
const usersRouter = require("./controllers/user")
const adminRouter = require("./controllers/admin")
const blogRouter = require("./controllers/blog")


mongoose.set("strictQuery", false)

mongoose.connect(config.MONGO_URI)
    .then(() => {
        logger.info("Successfully connected to mongodb")
    })
    .catch(e => {
        logger.error(`Error connecting to mongodb: ${e.message}`)
    })

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan("dev"))


//configured routes
app.use("/api/users", usersRouter)
app.use("/api/admin", adminRouter)
app.use("/api/blogs", blogRouter)


module.exports = app