const jwt = require("jsonwebtoken")
const config = require("./config")
const logger = require("./logger")

exports.getTokenFrom = (request) =>  {
    const authorization = request.get("authorization")
    if(authorization && authorization.startsWith("Bearer ")) {
        return authorization.replace("Bearer ", '')
    }
    return null
}

exports.authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null ) return res.status(401)

    jwt.verify(token, config.SECRET, (err, user) => {
        if(err) {
            logger.error(err.message)
            return res.status(403)
        }
        req.user = user
        next()
    })
}