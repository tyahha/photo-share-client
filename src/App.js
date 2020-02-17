import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";
import Users from "./Users";
import { gql } from "apollo-boost";
import { useApolloClient } from "react-apollo";
import Photos from "./Photos";
import PostPhoto from "./PostPhoto";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`;

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      githubLogin
      name
      avatar
    }
  }
`;

const LISTEN_FOR_PHOTOS = gql`
  subscription {
    newPhoto {
      id
      name
      url
    }
  }
`;

const App = () => {
  const client = useApolloClient();
  useEffect(() => {
    const subscriveUsers = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        client.writeQuery({
          query: ROOT_QUERY,
          data: {
            ...data,
            totalUsers: data.totalUsers + 1,
            allUsers: [...data.allUsers, newUser]
          }
        });
      });

    const subscribePhotos = client
      .subscribe({ query: LISTEN_FOR_PHOTOS })
      .subscribe(({ data: { newPhoto } }) => {
        const data = client.readQuery({ query: ROOT_QUERY });
        client.writeQuery({
          query: ROOT_QUERY,
          data: {
            ...data,
            totalPhotos: data.totalPhotos + 1,
            allPhotos: [...data.allPhotos, newPhoto]
          }
        });
      });
    return () => {
      subscriveUsers.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <AuthorizedUser />
          <Users />
          <Photos />
        </Route>
        <Route path="/newPhoto">
          <PostPhoto />
        </Route>
        <Route
          component={({ location }) => <h1>"{location.pathname}" not found</h1>}
        />
      </Switch>
    </BrowserRouter>
  );
};
export default App;
