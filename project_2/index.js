import { createSchema, createYoga } from 'graphql-yoga';
import { createServer } from 'node:http';
import axios from 'axios';
import DataLoader from 'dataloader';

const typeDefs = `
  type Geo {
    lat: String
    lng: String
  }
  
  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }
  
  type User {
    id: ID
    name: String
    username: String
    email: String
    address: Address
    posts: [Post]
    todos: [Todo]
  }
  
  type Todo {
    id: ID!
    userId: Int
    title: String
    completed: Boolean
    user: User
  }

  type Post {
    id: ID!
    userId: Int!
    title: String!
    body: String!
    comments: [Comment]
    user: User
  }

  type Comment {
    id: ID!
    postId: Int!
    name: String!
    email: String!
    body: String!
  }

  type Query {
    posts: [Post]
    post(id:ID!): Post
    users: [User]
    user(id: ID!): User
    todos: [Todo]
    todo(id: ID!): Todo
  }
`;

const API_URL_Users = 'https://jsonplaceholder.typicode.com/users';
const API_URL_Posts = 'https://jsonplaceholder.typicode.com/posts';
const API_URL_Todos = 'https://jsonplaceholder.typicode.com/todos';

const userLoader = new DataLoader(async (ids) => {
  const responses = await Promise.all(
    ids.map((id) => axios.get(`${API_URL_Users}/${id}`))
  );
  return responses.map((response) => response.data);
});

const postLoader = new DataLoader(async (ids) => {
  const responses = await Promise.all(
    ids.map((id) => axios.get(`${API_URL_Posts}/${id}`))
  );
  return responses.map((response) => response.data);
});

const todoLoader = new DataLoader(async (ids) => {
  const responses = await Promise.all(
    ids.map((id) => axios.get(`${API_URL_Todos}/${id}`))
  );
  return responses.map((response) => response.data);
});

const resolvers = {
  Query: {
    users: async () => {
      const response = await axios.get(API_URL_Users);
      return response.data;
    },
    user: async (_, { id }) => {
      return userLoader.load(id);
    },
    posts: async () => {
      const response = await axios.get(API_URL_Posts);
      return response.data;
    },
    post: async (_, { id }) => {
      return postLoader.load(id);
    },
    todos: async () => {
      const response = await axios.get(API_URL_Todos);
      return response.data;
    },
    todo: async (_parent, { id }) => {
      return todoLoader.load(id);
    },
  },
  Post: {
    comments: async (parent) => {
      const response = await axios.get(
        `${API_URL_Posts}/${parent.id}/comments`
      );
      return response.data;
    },
    user: async (parent) => {
      const response = await axios.get(`${API_URL_Users}/${parent.userId}`);
      return response.data;
    },
  },
  User: {
    posts: async (parent) => {
      const response = await axios.get(`${API_URL_Users}/${parent.id}/posts`);
      return response.data;
    },
    todos: async (parent) => {
      const response = await axios.get(`${API_URL_Users}/${parent.id}/todos`);
      return response.data;
    },
  },
  Todo: {
    user: async (parent) => {
      return userLoader.load(parent.userId);
    },
  },
};

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
});

const server = createServer(yoga);
server.listen(3000, () => {
  console.info('Server is running on http://localhost:3000/graphql');
});
