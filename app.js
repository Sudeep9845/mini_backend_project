// Import required modules
const express = require("express");
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Initialize express app
const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
// Set path for static files (e.g., CSS, client-side JS)
app.use(express.static(path.join(__dirname, "./public")));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies
app.use(cookieParser());

// Route to render the home page
app.get("/", (req, res) => {
	res.render("index");
});

// Route to render the login page
app.get("/login", (req, res) => {
	res.render("login");
});

// Protected route to render the user's profile page
// `isLoggedIn` middleware ensures only authenticated users can access it
app.get("/profile", isLoggedIn, (req, res) => {
	console.log(req.user);
	res.render("profile", { user: req.user });
});

// Route to handle user logout
app.get("/logout", (req, res) => {
	// Clear the token cookie
	res.cookie("token", "");
	// Redirect to the login page
	res.redirect("/login");
});

// Route to handle user registration
app.post("/register", async (req, res) => {
	//find if the user already exists
	let { username, email, password, age, name } = req.body;
	let user = await userModel.findOne({ email: email });
	if (user) return res.status(500).send("User already exists");

	// Hash the password before saving
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, async (err, hash) => {
			// Create a new user in the database
			let user = await userModel.create({
				username,
				name,
				age,
				email,
				password: hash,
			});
			// Create a JWT token for the new user
			let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
			// Set the token in a cookie
			res.cookie("token", token);
			res.send("Registered Successfully");
		});
	});
});

// Route to handle user login
app.post("/login", async (req, res) => {
	// Extract email and password from request body
	let { email, password } = req.body;
	// Find the user by email
	let user = await userModel.findOne({ email: email });
	// If user doesn't exist, send an error
	if (!user) return res.status(500).send("Something went wrong");

	// Compare the provided password with the stored hashed password
	bcrypt.compare(password, user.password, (err, result) => {
		// If passwords match
		if (result) {
			// Create a JWT token
			let token = jwt.sign({ email: email, userid: user._id }, "shhhh");
			// Set the token in a cookie
			res.cookie("token", token);
			res.status(200).send("Logged in Successfully");
		} else {
			// If passwords don't match, redirect to login
			res.redirect("/login");
		}
	});
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
	// Check if the token cookie exists
	if (!req.cookies.token) {
		return res.status(401).send("You must be logged in to view this page");
	}
	try {
		// Verify the JWT token
		let data = jwt.verify(req.cookies.token, "shhhh");
		// Attach user data from the token to the request object
		req.user = data;
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		// If token is invalid, send an error
		return res.status(401).send("You must be logged in to view this page");
	}
}

// Generic error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(404).send("Something broke!");
});

// Start the server
app.listen(port, () =>
	console.log(`Server running at http://localhost:${port}`)
);
