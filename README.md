# Backend Mini-Project: A Social Media Web App

This project is a personal learning exercise where I built a **mini-social media application** to solidify my understanding of backend development with **Node.js**.  
It's a foundational project that covers essential concepts like **user authentication, database management, and file uploads**.

> **Note:** This project was created for personal learning purposes and does not follow industry-standard file structures or practices. Its primary goal was to provide hands-on experience with the backend technologies used.

---

## 🚀 Key Features

- **User Management:** Register, log in, and log out of an account.
- **Profile Management:** View profile, update profile picture, and manage posts.
- **Content Creation:** Authenticated users can create, edit, and like posts.
- **Secure Authentication:** Passwords encrypted with **bcrypt**; sessions managed using **JWT** and cookies.
- **File Uploads:** Upload profile pictures with **Multer** middleware.

---

## 🛠️ Technologies Used

- **Node.js & Express.js** → Core backend framework for APIs and server logic  
- **MongoDB & Mongoose** → NoSQL database & ODM for managing users and posts  
- **EJS (Embedded JavaScript Templating)** → Server-side rendering for HTML pages  
- **Tailwind CSS** → Utility-first CSS framework for styling  
- **bcrypt** → Secure password hashing  
- **JSON Web Token (JWT)** → Authentication with signed tokens  
- **cookie-parser** → Parse and manage cookies  
- **Multer** → Handle file uploads  

---

## 📂 Project Structure

```bash
├── app.js
├── models/
│   ├── user.js
│   └── post.js
├── views/
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── edit.ejs
│   └── profileupdate.ejs
├── public/
│   ├── images/
│   │   └── uploads/
│   └── stylesheets/
│       └── output.css
├── config/
│   └── multer.js
└── package.json

---

## 📌 File Contents and Purpose

- **`models/user.js`** → Defines Mongoose schema for users (username, email, password, posts reference).  
- **`models/post.js`** → Defines Mongoose schema for posts (content, date, likes, user reference).  
- **`config/multer.js`** → Configures Multer for handling file uploads (uploads stored in `public/images/uploads`).  
- **`app.js`** → Main server file: initializes Express, connects DB, sets up routes for authentication, profile, and posts. Includes `isLoggedIn` middleware for route protection.  
- **`views/` (EJS templates):**  
  - `index.ejs` → Registration form  
  - `login.ejs` → Login form  
  - `profile.ejs` → User dashboard (profile + posts + new post form)  
  - `edit.ejs` → Edit an existing post  
  - `profileupdate.ejs` → Upload new profile picture  

---

## ⚡ Getting Started

### 1. Clone the Repository

git clone <your_repository_url>
cd <project_directory>

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup MongoDB

- Ensure you have a local or remote MongoDB instance running.
- Update the connection string in **`models/user.js`** with your MongoDB URI.

### 4. Run the Server

```bash
node app.js
```

- Visit: Not Hosted Yet

---

## 📚 Learning Experience

Through this project, I gained valuable **hands-on experience** with:

- Setting up a Node.js server using Express
- Designing and managing schemas with Mongoose
- Implementing **secure authentication** with bcrypt & JWT
- Handling **file uploads** (multipart/form-data) with Multer
- Integrating backend logic with frontend templates using EJS

This project was a **crucial step** in my backend development journey, helping me build confidence in real-world concepts and workflows.
