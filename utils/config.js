require("dotenv").config()

PORT = process.env.PORT
MONGO_URI = process.env.MONGO_URI
SECRET = process.env.SECRET
ADMIN_SECRET = process.env.ADMIN_SECRET

module.exports = {
    PORT,
    MONGO_URI,
    SECRET,
    ADMIN_SECRET
}