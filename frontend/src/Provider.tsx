import React, { useMemo } from 'react'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from '@apollo/react-hooks'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { BrowserRouter } from 'react-router-dom'
import introspectionQueryResultData from 'generated/fragmentTypes.json'
import { HyperLink } from 'util/hyperLink'
import { createHttpLink } from 'apollo-link-http'
import { useToken, TokenProvider } from 'components/TokenService'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData
})

const ENDPOINT = '/endpoint'

function createWsClient(endpoint: string, authorization: string) {
  const WsProtocol = window.location.protocol.replace('http', 'ws')
  const client = new SubscriptionClient(`${WsProtocol}//${window.location.host}${endpoint}`, {
    reconnect: true,
    lazy: true,
    connectionParams: {
      Authorization: authorization
    },
  })
  return client
}

function authLink(authorization: string) {
  return setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: authorization,
      }
    }
  })
}

function getLink(token: string) {
  const authorization = token ? `Bearer ${token}` : ''
  const ws = createWsClient(ENDPOINT, authorization)
  const http = createHttpLink({ uri: ENDPOINT })
  let link = authLink(authorization).concat(
    new HyperLink(ws, http)
  )
  return link
}

const ApolloClientProvider: React.FC = ({ children }) => {
  const token = useToken()
  const client = useMemo(() => new ApolloClient({
    link: getLink(token),
    cache: new InMemoryCache({ fragmentMatcher }),
  }), [token])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}

export const Provider: React.FC = ({ children }) => (
  <TokenProvider>
    <BrowserRouter>
      <ApolloClientProvider>
        {children}
      </ApolloClientProvider>
    </BrowserRouter>
  </TokenProvider>
)
