import { GraphQLServer } from 'graphql-yoga'

// Part II
// Goal: Set up a relationship between Comment and User
//
// 1. Set up an author field on Comment
// 2. Update all comments in the array to have a new author field (use one of the user ids as value)
// 3. Create a resolver for the Comments author field that returns the user who wrote the comment
// 4. Run a sample query that gets all comments and gets the author's name
// 5. Set up a comments field on User
// 6. Set up a resolver for the User comments field that returns all comments belonging to that user
// 7. Run a sample query that gets all users and all their comments

// 5 Scalar types (single value): String, Boolean, Int, Float, ID,

// Demo user data
const users = [
  {
    id: '1',
    name: 'Jesse',
    email: 'jesse@example.com',
    age: 38,
  },
  {
    id: '2',
    name: 'Dylan',
    email: 'dylan@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
]

// Demo post data
const posts = [
  {
    id: '1',
    title: 'My first post',
    body: 'This is my first example posts to use for testing!',
    published: true,
    author: '1',
  },
  {
    id: '2',
    title: 'My second post',
    body: 'Another example of posting.',
    published: false,
    author: '1',
  },
  {
    id: '3',
    title: 'My last post',
    body: 'The last time a post will be tested (for now).',
    published: true,
    author: '2',
  },
]

const comments = [
  {
    id: '1',
    text: 'nice post!',
    author: '3',
  },
  {
    id: '2',
    text: `I didn't like this post`,
    author: '2',
  },
  {
    id: '3',
    text: 'I agree!',
    author: '1',
  },
  {
    id: '4',
    text: 'I strongly disagree',
    author: '2',
  },
]

// Type definitions (Schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
  }
`

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts
      }

      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        )
      })
    },
    comments(parent, args, ctx, info) {
      return comments
    },
    me() {
      return {
        id: '123098',
        name: 'Jesse',
        email: 'Jesse@example.com',
        age: 38,
      }
    },
    post() {
      return {
        id: '123098',
        title: 'New Post',
        body: 'This is a post body',
        published: false,
      }
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id
      })
    },
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up!')
})
