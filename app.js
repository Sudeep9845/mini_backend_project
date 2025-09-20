const express = require("express");
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// set view engine
app.set("view engine", "ejs");
// set path for static files
app.use(express.static(path.join(__dirname, "./public")));

// Middlewares for body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
	res.render("index");
});
app.post("/register", async (req, res) => {
	//find if the user already exists
	let { username, email, password, age, name } = req.body;
	let user = await userModel.findOne({ email: email });
	if (user) return res.status(500).send("User already exists");

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, async (err, hash) => {
			let user = await userModel.create({
				username,
				name,
				age,
				email,
				password: hash,
			});
            let token = jwt.sign({ email: email, userid: user._id }, 'shhhh');
            res.cookie('token', token)
            res.send("Registered Successfully")
		});
	});
});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(404).send("Something broke!");
});

app.listen(port, () =>
	console.log(`Server running at http://localhost:${port}`)
);
