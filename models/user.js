const mongoose = require("mongoose");

mongoose
	.connect(`mongodb://172.24.96.1:27017/post_app`)
	.then(() => console.log("mongodb connected..."))
    .catch(err => console.log("mongodb failed to connect..."));
    
const userSchema = mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,
    profilepic: {
        type: String,
        default: "default.jpg"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }]
})

module.exports = mongoose.model("user", userSchema);

