import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid'

//
// Goal: Create input types for createPost and createComment
//
// 1. Create an input for createPost with the same fields.  Use "data or "post" as arg name.
// 2. Update createPost resolver to use this new object.
// 3. Verify application still works by creating a post and then fetching it.
// 4. Create an input type for createComment with the same fields.  Use "data or "comment as arg name.
// 5. Update createComment resolver to use this new object.
// 6. Verify applicaiton still works by creating a comment and then fetching it.

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
    post: '1',
  },
  {
    id: '2',
    text: `I didn't like this post`,
    author: '2',
    post: '2',
  },
  {
    id: '3',
    text: 'I agree!',
    author: '1',
    post: '3',
  },
  {
    id: '4',
    text: 'I strongly disagree',
    author: '2',
    post: '2',
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

  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
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
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.data.email)
      if (emailTaken) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuidv4(),
        ...args.data,
      }

      users.push(user)

      return user
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)

      if (!userExists) {
        throw new Error('User not found')
      }

      const post = {
        id: uuidv4(),
        ...args.data,
      }

      posts.push(post)

      return post
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      const postExists = posts.some(post => post.id === args.data.post)
      const postIsPublished = posts.find(post => post.id === args.data.post)
        .published

      if (!userExists) {
        throw new Error('User not found')
      }

      if (!postExists) {
        throw new Error('Post not found')
      } else if (!postIsPublished) {
        throw new Error('Post is not published')
      }

      const comment = {
        id: uuidv4(),
        ...args.data,
      }

      comments.push(comment)

      return comment
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id
      })
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post
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
