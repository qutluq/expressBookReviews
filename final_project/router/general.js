const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const { compareNames, userExists } = require('../utils/index.js')

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!userExists(users, username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn.trim();
  const book = books[isbn];
  console.log({})
  if(book){
    return res.status(200).send(JSON.stringify(book));
  }
  return res.status(404).json({ message: `Book with isbn:${isbn} not found` });

});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.trim();
  const filteredBooks = Object.keys(books).filter((bookId) => {
    const book = books[bookId];
    if(compareNames(book.author, author)){
        return true
    }
    return false
  }).map((bookId) => books[bookId])

  if(filteredBooks.length){
    return res.status(200).send(JSON.stringify(filteredBooks));
  }

  return res.status(404).json({ message: `No book with author:${author} found` });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.trim();
  const filteredBooks = Object.keys(books).filter((bookId) => {
    const book = books[bookId];
    if(compareNames(book.title, title)){
        return true
    }
    return false
  }).map((bookId) => books[bookId])

  if(filteredBooks.length){
    return res.status(200).send(JSON.stringify(filteredBooks));
  }

  return res.status(404).json({ message: `No book with title:${title} found` });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn.trim();
  const filteredReviews = Object.keys(books).filter((bookId) => {
    const book = books[bookId];
    if(compareNames(bookId, isbn)){
        return true
    }
    return false
  }).map((bookId) => books[bookId].reviews)

  if(filteredReviews.length){
    return res.status(200).send(JSON.stringify(filteredReviews));
  }

  return res.status(404).json({ message: `No book with isbn:${isbn} found` });
});

module.exports.general = public_users;
