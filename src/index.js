import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import './styles/index.css'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient, InMemoryCache, HttpLink, gql } from 'apollo-client-preset'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const serviceId = 'cj9su1gki8qn00182h37oa733'
const httpLink = new HttpLink({uri: `https://api.graph.cool/simple/v1/${serviceId}`})

const wsLink = new WebSocketLink({
  uri: `wss://subscriptions.graph.cool/v1/${serviceId}`,
  options: {
    reconnect: true
  }
})

const isSubscription = gqlOperation => {
  const { kind, operation } = getMainDefinition(gqlOperation.query)
  return kind === 'OperationDefinition' && operation === 'subscription'
}

const link = split(
  isSubscription,
  wsLink,
  httpLink,
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
})


ReactDOM.render(
  <ApolloProvider client={client}>
  <App />
  </ApolloProvider>,
  document.getElementById('root')
)
