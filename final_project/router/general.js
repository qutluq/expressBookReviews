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
public_users.get("/", async (req, res) => {
  //Write your code here

  const booksPromise = new Promise((resolve,reject) => {
    if(books){
      resolve(books)
      return;
    }
    
    reject("No books found")
  })

  try{
    const books = await booksPromise;
    return res.status(200).send(JSON.stringify(books));
  }catch(e){
    return res.status(404).json({ message: e });
  }
  
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const bookPromise = (isbn) => new Promise((resolve,reject) => {
    const book = books[isbn];
    if(book){
      resolve(book)
      return;
    }
    
    reject("No book found with the given isbn")
  })

  const isbn = req.params.isbn.trim();
  
  try{
    const book = await bookPromise(isbn);
    return res.status(200).send(JSON.stringify(book));
  }catch(e){
    return res.status(404).json({ message: e });
  }
  
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const booksPromise = (author) => new Promise((resolve,reject) => {
    const filteredBooks = Object.keys(books).filter((bookId) => {
      const book = books[bookId];
      if(compareNames(book.author, author)){
          return true
      }
      return false
    }).map((bookId) => books[bookId])

    if(filteredBooks.length){
      resolve(filteredBooks)
      return;
    }
    
    reject("No book found with the given author")
  })

  const author = req.params.author.trim();
  
  try{
    const books = await booksPromise(author);
    return res.status(200).send(JSON.stringify(books));
  }catch(e){
    return res.status(404).json({ message: e });
  }  

});

// Get all books based on title
public_users.get("/title/:title", async (req, res) => {
  const booksPromise = (title) => new Promise((resolve,reject) => {
    const filteredBooks = Object.keys(books).filter((bookId) => {
      const book = books[bookId];
      if(compareNames(book.title, title)){
          return true
      }
      return false
    }).map((bookId) => books[bookId])

    if(filteredBooks.length){
      resolve(filteredBooks)
      return;
    }
    
    reject("No book found with the given title")
  })

  const title = req.params.title.trim();
  
  try{
    const books = await booksPromise(title);
    return res.status(200).send(JSON.stringify(books));
  }catch(e){
    return res.status(404).json({ message: e });
  }  

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
