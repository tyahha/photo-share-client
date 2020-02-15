import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { request } from "graphql-request";

const url = "http://localhost:4000/graphql";

const query = `
  query listUsers {
    allUsers {
      avatar
      name
    }
  }
`;

const mutation = `
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
    }
  }
`;

function App({ users = [] }) {
  return (
    <div>
      {users.map(user => (
        <div key={user.githubLogin}>
          <img src={user.avatar} alt="" />
          {user.name}
        </div>
      ))}
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

const addUser = () =>
  request(url, mutation, { count: 1 })
    .then(requestAndRender)
    .catch(console.error);

const requestAndRender = () =>
  request(url, query)
    .then(render)
    .catch(console.error);

export default App;

const render = ({ allUsers = [] }) =>
  ReactDOM.render(<App users={allUsers} />, document.getElementById("root"));

requestAndRender();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
