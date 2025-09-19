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
})

module.exports = mongoose.model("user", userSchema);

