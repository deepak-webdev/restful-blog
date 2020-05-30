const express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
methodOverride = require("method-override");
expressSanitizer = require("express-sanitizer");

app = express();

// App Config
mongoose.connect("mongodb://127.0.0.1:27017/restful_blog_app", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(expressSanitizer());
// Mongoose/Model Config
const Blog = mongoose.model("Blog", {
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    body: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

// const blogData = new Blog({
//     title: "Test Blog!",
//     image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "This is a blog post!"
// })

// blogData.save().then(() => {
//     console.log(blogData)
// }).catch((error) => {
//     console.log("Error:", error)
// })

// Restful Routes
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", (req, res) => {
    Blog.find({}, (error, blogs) => {
        if (error) {
            console.log(error);
        } else {
            res.render("index", {
                blogs: blogs,
            });
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req, res) => {
    // create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (error, newBlog) => {
        if (error) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("show", {
                blog: foundBlog
            });
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
    Blog.findById(req.params.id, (error, foundBlog) => {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {
                blog: foundBlog
            });
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", (req, res) => {
    // sanitizing
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (error, updatedBlog) => {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", (req, res) => {
    // destroy blog
    Blog.findByIdAndRemove(req.params.id, (error) => {
        if (error) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
    // redirect somewhere
});

app.listen(3000, () => {
    console.log("Server is running!!");
});