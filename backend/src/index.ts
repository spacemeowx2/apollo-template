import 'reflect-metadata'
import { ApolloServer, gql } from 'apollo-server-express'
import { readFileSync } from 'fs'
import { resolvers } from './resolvers'
import express from 'express'

async function main() {
  const app = express()
  const port = 8010
  const schema = readFileSync('./schema/schema.graphql', 'utf-8')
  const typeDefs = gql`${schema}`

  const server = new ApolloServer({ typeDefs, resolvers })
  server.applyMiddleware({ app, path: '/endpoint' })
  app.listen(port)
  console.log(`🚀  Server ready at http://localhost:${port}`)
}
main().catch(err => console.error(err))
