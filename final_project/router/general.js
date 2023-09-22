const express = require('express');
const session = require('express-session')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const getBooksUsingPromise = () => {
  // Simulate an asynchronous operation (replace with your actual code)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(books); // Resolve the Promise with the list of books
    }, 1000); // Simulate a delay of 1 second
  });
};

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  getBooksUsingPromise() // Call the function to get books
    .then((books) => {
      res.send(books); // Send the list of books as a response
    })
    .catch((error) => {
      res.status(500).json({ error: 'Error fetching books' }); // Handle errors
    });
});

const findBookByISBN = (isbn) => {
  // Simulate an asynchronous operation (replace with your actual code)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (books[isbn]) {
        resolve(books[isbn]); // Resolve the Promise with the book details
      } else {
        reject({ error: 'Book not found' }); // Reject the Promise with an error object
      }
    }, 1000); // Simulate a delay of 1 second
  });
};

const findBooksByAuthor = (author) => {
  // Simulate an asynchronous operation (replace with your actual code)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor); // Resolve the Promise with the book details
      } else {
        reject({ error: 'Author not found' }); // Reject the Promise with an error object
      }
    }, 1000); // Simulate a delay of 1 second
  });
};

const findBooksByTitle = (title) => {
  // Simulate an asynchronous operation (replace with your actual code)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksWithTitle = Object.values(books).filter(book => book.title === title);

      if (booksWithTitle.length > 0) {
        resolve(booksWithTitle); // Resolve the Promise with the book details
      } else {
        reject({ error: 'Book not found' }); // Reject the Promise with an error object
      }
    }, 1000); // Simulate a delay of 1 second
  });
};


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbnParam = req.params.isbn;

  findBookByISBN(isbnParam) // Call the function to find the book by ISBN
    .then((bookDetails) => {
      res.json(bookDetails); // Send the book details as a JSON response
    })
    .catch((error) => {
      res.status(404).json(error); // Return a 404 error if the book is not found
    });
});

  


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  findBooksByAuthor(author) // Call the function to find books by the author
    .then((booksByAuthor) => {
      res.json(booksByAuthor); // Send the book details as a JSON response
    })
    .catch((error) => {
      res.status(404).json(error); // Return a 404 error if no books by the author are found
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  findBooksByTitle(title) // Call the function to find books by title
    .then((booksWithTitle) => {
      res.json(booksWithTitle); // Send the book details as a JSON response
    })
    .catch((error) => {
      res.status(404).json(error); // Return a 404 error if no books with the title are found
    });
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
