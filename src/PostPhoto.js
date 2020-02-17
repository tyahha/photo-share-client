import React, { useState } from "react";
import { useHistory } from "react-router";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo";

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      id
      name
      url
    }
  }
`;

const PostPhoto = () => {
  const history = useHistory();
  const [postPhoto] = useMutation(POST_PHOTO_MUTATION);
  const [photo, setPhoto] = useState({
    name: "",
    description: "",
    category: "PORTRAIT",
    file: ""
  });

  return (
    <form
      onSubmit={e => e.preventDefault()}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start"
      }}
    >
      <h1>Post a Photo</h1>

      <input
        type="text"
        style={{ margin: "10px" }}
        placeholder="photo name..."
        value={photo.name}
        onChange={({ target }) => setPhoto({ ...photo, name: target.value })}
      />
      <input
        type="text"
        style={{ margin: "10px" }}
        placeholder="photo description..."
        value={photo.description}
        onChange={({ target }) =>
          setPhoto({ ...photo, description: target.value })
        }
      />

      <select
        value={photo.category}
        style={{ margin: "10px" }}
        onChange={({ target }) =>
          setPhoto({ ...photo, category: target.value })
        }
      >
        <option value="PORTRAIT">PORTRAIT</option>
        <option value="LANDSCAPE">LANDSCAPE</option>
        <option value="ACTION">ACTION</option>
        <option value="GRAPHIC">GRAPHIC</option>
      </select>

      <input
        type="file"
        accept="image/jpeg"
        style={{ margin: "10px" }}
        onChange={({ target }) =>
          setPhoto({
            ...photo,
            file: target.files && target.files.length ? target.files[0] : ""
          })
        }
      />

      <div style={{ margin: "10px" }}>
        <button
          onClick={async () => {
            await postPhoto({
              variables: {
                input: photo
              }
            }).catch(console.error);
            history.replace("/");
          }}
        >
          Post photo
        </button>
        <button onClick={() => history.goBack()}>Cancel</button>
      </div>
    </form>
  );
};

export default PostPhoto;
