import React from "react";
import { BrowserRouter } from "react-router-dom";
import AuthorizedUser from "./AuthorizedUser";
import Users from "./Users";
import { gql } from "apollo-boost";

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

const App = () => (
  <BrowserRouter>
    <AuthorizedUser />
    <Users />
  </BrowserRouter>
);
export default App;
