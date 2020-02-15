import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Query, Mutation } from "react-apollo";
import { gql } from "apollo-boost";
import { ROOT_QUERY } from "./App";

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

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {q => {
      const { loading, data } = q;
      return data && data.me ? (
        <CurrentUser {...data.me} logout={logout} />
      ) : loading ? (
        <p>loading... </p>
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign In with Github
        </button>
      );
    }}
  </Query>
);

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} width={48} height={48} alt="" />
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
  </div>
);

const Inner = ({ githubAuthMutation, signingIn, setSigningIn }) => {
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
      logout={() => localStorage.removeItem("token")}
    />
  );
};

const AuthorizedUser = () => {
  const history = useHistory();
  const [signingIn, setSigningIn] = useState(false);

  const authorizationComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    history.replace("/");
    setSigningIn(false);
  };

  return (
    <Mutation
      mutation={GITHUB_AUTH_MUTATION}
      update={authorizationComplete}
      refetchQueries={[{ query: ROOT_QUERY }]}
    >
      {mutation => (
        <Inner
          githubAuthMutation={mutation}
          signingIn={signingIn}
          setSigningIn={setSigningIn}
        />
      )}
    </Mutation>
  );
};

export default AuthorizedUser;
