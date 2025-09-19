const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// set view engine
app.set("view engine", "ejs");
// set path for static files 
app.use(express.static(path.join(__dirname, "./public")))

// 
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

app.get("/", (req, res) => {
	res.send("hello");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () =>
	console.log(`Server running at http://localhost:${port}`)
);
