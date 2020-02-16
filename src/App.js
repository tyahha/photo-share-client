import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";
import Users from "./Users";
import { gql } from "apollo-boost";
import { useApolloClient } from "react-apollo";

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      ...userInfo
    }
    me {
      ...userInfo
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

const App = () => {
  const client = useApolloClient();
  useEffect(() => {
    const sub = client
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
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <AuthorizedUser />
      <Users />
    </BrowserRouter>
  );
};
export default App;
