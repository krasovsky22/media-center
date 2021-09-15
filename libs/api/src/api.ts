import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';

export type FavoriteType = {
  id: string;
  source: string;
  username: string;
  videoId: string;
};

export type FavoriteInputType = {
  source: string;
  videoId: string;
};

export const fetchFavorites = async (): Promise<FavoriteType[]> => {
  const queryResult = (await API.graphql({
    query: queries.ListFavoritesByUsername,
  })) as GraphQLResult<{ listFavoritesByUsername: FavoriteType[] }>;

  return queryResult.data?.listFavoritesByUsername ?? [];
};

export const createFavorite = async (
  favoriteInput: FavoriteInputType
): Promise<FavoriteType | null> => {
  const queryResult = (await API.graphql({
    query: mutations.createFavorite,
    variables: { input: favoriteInput },
  })) as GraphQLResult<{ createFavorite: FavoriteType }>;

  return queryResult.data?.createFavorite ?? null;
};
