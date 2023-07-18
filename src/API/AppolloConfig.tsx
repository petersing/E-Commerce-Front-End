import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { ParseCookies } from "../Component/Public_Data/Public_Application";
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql/',
  });

const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {

    const token = ParseCookies(window.document.cookie).access;

    // return the headers to the context so httpLink can read them
    return {
        headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
        }
    }
});

var GraphQL_Connect = new ApolloClient({link: authLink.concat(httpLink),cache: cache})

persistCache({
    cache,
    storage: new LocalStorageWrapper(window.sessionStorage),
  }).then(() => {
    GraphQL_Connect.cache = cache
})


export default GraphQL_Connect;
