const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const uniqueValidator = require("mongoose-unique-validator")

const blogSchema = new Schema({
    title: {type: String, trim: true, required: true, unique: true},
    content: {type: String, trim: true, required: true},
    Image: String,
    // user: {type: Schema.Types.ObjectId, ref: "User"},
    user: String,
    createdAt: {type: Date, default: new Date().toLocaleDateString()},
    updatedAt: {type: Date}
})

// blogSchema.plugin(uniqueValidator)

blogSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model("Blog", blogSchema)