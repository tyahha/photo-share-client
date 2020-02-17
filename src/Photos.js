import React from "react";
import { ROOT_QUERY } from "./App";
import { useQuery } from "react-apollo";

const Photos = () => {
  const { loading, data } = useQuery(ROOT_QUERY);
  return loading ? (
    <p>loading...</p>
  ) : (
    data.allPhotos.map(photo => (
      <img key={photo.id} src={photo.url} alt={photo.name} width={350} />
    ))
  );
};

export default Photos;
