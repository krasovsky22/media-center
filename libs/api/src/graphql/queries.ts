import gql from 'graphql-tag';

export const ListFavoritesByUsername = gql`
  query listFavoritesByUsername {
    listFavoritesByUsername {
      id
      username
      videoId
      source
    }
  }
`;
