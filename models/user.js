const mongoose = require("mongoose")
const Schema = mongoose.Schema
// const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new Schema({
    username: {type: String, trim: true, required: true, unique: true},
    email: {type: String, trim: true, required: true, unique: true},
    passwordHash: {type: String, trim: true, required: true, unique: true},
    role: String,
    image: String,
    createdAt: {type: Date, default: new Date().toLocaleDateString()},
    updatedAt: {type: Date},
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: "Blog"
    }]
})

// userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        //we will need to delete the password hash which should not be revealed
        delete returnedObject.passwordHash
    }
})

module.exports = mongoose.model("User", userSchema)