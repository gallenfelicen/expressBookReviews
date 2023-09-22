const express = require('express');
const session = require('express-session')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books);
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnParam = req.params.isbn;
  
  // Find the book in the database based on ISBN
  if (books[isbnParam]) {
    res.json(books[isbnParam]); // Send the book details as JSON response
  } else {
    res.status(404).json({ error: 'Book not found' }); // Return a 404 error if ISBN is not found
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  // Find the book in the database based on author
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor); // Send the book details as JSON response
  } else {
    res.status(404).json({ error: 'Author not found' }); // Return a 404 error if author is not found
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  const bookwithtitle = Object.values(books).filter(book => book.title === title);
  // Find the book in the database based on author
  if (bookwithtitle.length) {
    res.json(bookwithtitle); // Send the book details as JSON response
  } else {
    res.status(404).json({ error: 'Book not found' }); // Return a 404 error if author is not found
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnParam = req.params.isbn;
  
  // Find the book reviews in the database based on ISBN
  if (books[isbnParam]) {
    const bookreviews = books[isbnParam].reviews;
    res.json(bookreviews); // Send the book details as JSON response
  } else {
    res.status(404).json({ error: 'Book not found' }); // Return a 404 error if ISBN is not found
  }
});

public_users.put('/addreview', (req,res) => {
  const isbn = req.body.isbn;
  const review = req.body.review;
  const username = req.session.user;

  if (books[isbn])
  {
    if (books[isbn].reviews[username])
    {
      books[isbn].reviews[username] = review;
      res.send("The review has been modified!");
    }
    else {
      books[isbn].reviews[username] =review;
      res.send("The review has been added!");
    }
  }
  else
  {
    res.send("The book with the ISBN " + isbn + " does not exist!");
  }

});

public_users.delete('/delete', (req,res) => {
  const isbn = req.body.isbn;
  const username = req.session.user;

  if (books[isbn])
  {
    if (books[isbn].reviews[username])
    {
      delete books[isbn].reviews[username];
      res.send("The review has been deleted.");
    }
    else {
      res.send("User " + username + "has not reviewed the book with the ISBN " + isbn);
    }
  }
  else
  {
    res.send("The book with the ISBN " + isbn + " does not exist!");
  }

});

module.exports.general = public_users;
