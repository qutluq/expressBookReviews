const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");

const regd_users = express.Router();
const { userCredentialsAreValid } = require("../utils/index.js");

let users = [];

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (userCredentialsAreValid(users, username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 50 * 60 });

    req.session.authorization = {
      accessToken, username
    };

    return res.status(200).json({ message: "Logged in successfully" });
  }
  return res.status(401).json({ message: "Either username or password are invalid" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  
  const book = books[isbn];
  if(book){
    if(book.reviews[username]){
      //rewrite existing book review
      book.reviews = {...book.reviews, [username]: review}
      return res.status(201).json({ message: "Book review was updated" });
    }else{
      //create new review
      book.reviews = {...book.reviews, [username]: review}
      return res.status(201).json({ message: "Book review was created" });
    }
  }

  return res.status(404).json({ message: "No book was with the given isbn" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  
  const book = books[isbn];
  if(book){
    if(book.reviews[username]){
      //rewrite existing book review
      delete book.reviews[username];
      return res.status(200).json({ message: "Book review was deleted" });
    }else{
      //create new review
      book.reviews = {...book.reviews, [username]: review}
      return res.status(404).json({ message: "No review to delete" });
    }
  }

  return res.status(404).json({ message: "No book was with the given isbn" });
});

module.exports.authenticated = regd_users;
module.exports.users = users;
