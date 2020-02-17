import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useApolloClient, useMutation, useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import { ROOT_QUERY } from "./App";
import { NavLink } from "react-router-dom";

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

const requestCode = () => {
  const clinentID = "e066004cbfb0e8d2b533";
  window.location = `https://github.com/login/oauth/authorize?client_id=${clinentID}&scope=user`;
};

const Me = ({ logout, requestCode, signingIn }) => {
  const { loading, data } = useQuery(ROOT_QUERY);

  return data && data.me ? (
    <CurrentUser {...data.me} logout={logout} />
  ) : loading ? (
    <p>loading... </p>
  ) : (
    <button onClick={requestCode} disabled={signingIn}>
      Sign In with Github
    </button>
  );
};

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
    <NavLink to="/newPhoto">Post Photo</NavLink>
  </div>
);

const AuthorizedUser = () => {
  const history = useHistory();
  const [signingIn, setSigningIn] = useState(false);
  const client = useApolloClient();

  const [githubAuthMutation] = useMutation(GITHUB_AUTH_MUTATION, {
    update: (cache, { data }) => {
      localStorage.setItem("token", data.githubAuth.token);
      history.replace("/");
      setSigningIn(false);
    },
    refetchQueries: [{ query: ROOT_QUERY }]
  });

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setSigningIn(true);
      const code = window.location.search.replace("?code=", "");
      githubAuthMutation({ variables: { code } });
    }
  }, [githubAuthMutation, setSigningIn]);

  return (
    <Me
      signingIn={signingIn}
      requestCode={requestCode}
      logout={() => {
        localStorage.removeItem("token");
        const data = client.readQuery({ query: ROOT_QUERY });
        client.writeQuery({ query: ROOT_QUERY, data: { ...data, me: null } });
      }}
    />
  );
};

export default AuthorizedUser;
