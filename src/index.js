import { GraphQLServer } from 'graphql-yoga'

// 5 Scalar types (single value): String, Boolean, Int, Float, ID,

// Type definitions (Schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    title() {
      return 'Great Product'
    },
    price() {
      return 1.95
    },
    releaseYear() {
      return null
    },
    rating() {
      return 4.5
    },
    inStock() {
      return true
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
