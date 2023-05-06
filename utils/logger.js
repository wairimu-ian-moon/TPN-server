const info = (...param) => {
    return console.log(...param)
}
const error = (...param) => {
    return console.error(...param)
}

module.exports = {
    info,
    error
}