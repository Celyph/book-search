const { ApolloServer } = require('@apollo/server');

const router = require('express').Router();
const {
  createUser,
  getSingleUser,
  saveBook,
  deleteBook,
  login,
} = require('../../controllers/user-controller');
const { expressMiddleware } = require('@apollo/server/express4');
const { cors } = require('cors');
const { json } = require('body-parser');


// import middleware
const { authMiddleware } = require('../../utils/auth');


const typeDefs = `#graphql

  type Book {
    title: String!
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
  }

  type User {
    username: String
    email: String
    savedBooks: [Book]
  }

  type Query {
    savedBooks: [Book]
    login: User
    me: User
  }

  type Mutation {
    createUser(name: String!, password: String!): User
    saveBook(bookId: String!): Book
    deleteBook(bookId: String!): Book
  }
`;

class GoogleBooksDataSource {
  async rGetUser() {
    if (!this.user) {
      this.user = await getSingleUser()
    }
    return this.user;
  }
  
  async rSaveBook(bookId) {
    const user = await getUser();

    if (user) {
      return await saveBook(user, {bookId: bookId});
    }

    return null;
  }

  async rCreateUser() {
    const user = await createUser();

    if (user) {
      return await saveBook(user, {bookId: bookId});
    }

    return null;
  }

  async rDeleteBook(bookId) {
    const user = await this.getUser();

    if (user) {
      return await deleteBook(user, {bookId: bookId});
    }

    return null;
  }
}

const resolvers = {}


// put authMiddleware anywhere we need to send a token for verification of user
const server = new ApolloServer({ typeDefs, resolvers, dataSources: () => {
  return {
    googleBooks: new GoogleBooksDataSource()
  }
}});

router.route('/').post(createUser).put(authMiddleware, saveBook);

module.exports = router;
module.exports.server = server;
