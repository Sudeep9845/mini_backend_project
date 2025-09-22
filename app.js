// Import required modules
const express = require("express");
const path = require("path");
const userModel = require("./models/user");
const postModel = require("./models/post");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const upload = require("./config/multer");

// Initialize express app
const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// Set path for static files (e.g., CSS, client-side JS)
app.use(express.static(path.join(__dirname, "./public")));

// Middleware to parse JSON bodies
app.use(express.json());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies
app.use(cookieParser());

// Disk storage code coppied from docs of multer
// const storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 		cb(null, "./public/images/uploads");
// 	},
// 	filename: function (req, file, cb) {
// 		crypto.randomBytes(12, (err, bytes) => {
// 			const fn = bytes.toString("hex") + path.extname(file.originalname);
// 			cb(null, fn);
// 		});
// 	},
// });

// const upload = multer({ storage: storage });

// Route to render the home page
app.get("/", (req, res) => {
	res.render("index");
});

// Route to render the login page
app.get("/login", (req, res) => {
	res.render("login");
});

// Route to handle user logout
app.get("/logout", (req, res) => {
	// Clear the token cookie
	res.cookie("token", "");
	// Redirect to the login page
	res.redirect("/login");
});

// Protected route to render the user's profile page
// `isLoggedIn` middleware ensures only authenticated users can access it
app.get("/profile", isLoggedIn, async (req, res) => {
	// populate() is used to replace the frontend data with actual data from db's it links queries of different db's
	let user = await userModel
		.findOne({ email: req.user.email })
		.populate("posts");
	res.render("profile", { user: user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
	let post = await postModel.findOne({ _id: req.params.id }).populate("user");
	if (post.likes.indexOf(req.user.userid) === -1) {
		post.likes.push(req.user.userid);
	} else {
		post.likes.splice(post.likes.indexOf(req.user.userid), 1);
	}
	await post.save();
	res.redirect("/profile");
});

app.get("/edit/:id", isLoggedIn, async (req, res) => {
	let post = await postModel.findOne({ _id: req.params.id }).populate("user");
	let user = await userModel.findOne({ email: req.user.email });
	// console.log(post)
	res.render("edit", { post, user });
});

// //Dummy route to learn Multer
// app.get("/test", (req, res) => {
// 	res.render("test");
// });

app.get("/profile/upload", isLoggedIn, async (req, res) => {
	const user = await userModel.findOne({ email: req.user.email });
	res.render("profileupdate", { user });
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
app.post("/login", isLoggedIn, async (req, res) => {
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
			res.status(200).redirect("/profile");
		} else {
			// If passwords don't match, redirect to login
			res.redirect("/login");
		}
	});
});

// Route to handel Post
app.post("/post", isLoggedIn, async (req, res) => {
	let user = await userModel.findOne({ email: req.user.email });
	let post = await postModel.create({
		user: user._id,
		content: req.body.content,
	});
	user.posts.push(post._id);
	await user.save();
	res.redirect("/profile");
});

// route to upadate post
app.post("/update/:id", isLoggedIn, async (req, res) => {
	let post = await postModel.findOneAndUpdate(
		{ _id: req.params.id },
		{ content: req.body.content }
	);
	res.redirect("/profile");
});

// route to upload files
// upload.single('image') this middleware indicates that the file is uploded through the 'image' named inputfield
// app.post("/upload",upload.single('image'), async (req, res) => {
// 	console.log(req.file);
// 	res.redirect("/test");
// });

app.post("/upload", isLoggedIn, upload.single("image"), async (req,res) => {
	let user = await userModel.findOne({ email: req.user.email });
	user.profilepic = req.file.filename;
	await user.save();
	res.redirect("/profile");
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
	// Check if the token cookie exists
	if (!req.cookies.token) res.redirect("/login");
	try {
		let data = jwt.verify(req.cookies.token, "shhhh");
		req.user = data;
		next();
	} catch (err) {
		console.log("JWT error:", err);
		return res.redirect("/login");
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
