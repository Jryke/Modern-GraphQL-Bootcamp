import { GraphQLServer } from 'graphql-yoga'

// 5 Scalar types (single value): String, Boolean, Int, Float, ID,

// Type definitions (Schema)
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      console.log('args: ', args)
      if (args.name && args.position) {
        return `Hello, ${args.name}! You are my favorite ${args.position}.`
      } else {
        return 'Hello!'
      }
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length === 0) {
        return 0
      }

      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },
    grades(parent, args, ctx, info) {
      return [99, 80, 93]
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
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => {
  console.log('The server is up!')
})
