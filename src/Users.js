import React from "react";
import { useQuery, useMutation } from "react-apollo";
import { gql } from "apollo-boost";
import { ROOT_QUERY } from "./App";

const ADD_FAKE_USERS_MUTATION = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

const Users = () => {
  const { loading, data, refetch } = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-and-network"
  });
  return loading ? (
    <p>loading users...</p>
  ) : (
    <UserList
      count={data.totalUsers}
      users={data.allUsers}
      refetchUsers={refetch}
    />
  );
};

const UserList = ({ count, users, refetchUsers }) => {
  const [addFakeUsers] = useMutation(ADD_FAKE_USERS_MUTATION);

  return (
    <div>
      <p>{count} Users</p>
      <button onClick={() => refetchUsers()}>Refetch Users</button>
      <button
        onClick={() =>
          addFakeUsers({
            variables: { count: 1 }
          })
        }
      >
        Add Fake Users
      </button>
      <ul>
        {users.map(user => (
          <UserListItem
            key={user.githubLogin}
            name={user.name}
            avatar={user.avatar}
          />
        ))}
      </ul>
    </div>
  );
};

const UserListItem = ({ name, avatar }) => (
  <li>
    <img src={avatar} width={48} height={48} alt="" />
    {name}
  </li>
);

export default Users;
