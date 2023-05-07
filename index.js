const http = require("http")
const app = require("./app")
const server = http.createServer(app)
const config = require("./utils/config")
const logger = require("./utils/logger")

// const PORT = config.PORT || 3001

server.listen(3001, () => {
    logger.info(`server running http://localhost:${PORT}`)
})