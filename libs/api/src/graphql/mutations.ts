import gql from 'graphql-tag';

export const createFavorite = gql`
  mutation createFavorite($input: FavoriteInput!) {
    createFavorite(favorite: $input) {
      id
      source
      username
      videoId
    }
  }
`;
