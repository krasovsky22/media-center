import { API } from 'aws-amplify';
import { GraphQLResult } from '@aws-amplify/api';

import * as queries from './graphql/queries';

export type FavoriteType = {
  id: string;
  source: string;
  username: string;
  videoId: string;
};

export const fetchFavorites = async (): Promise<FavoriteType[]> => {
  const queryResult = (await API.graphql({
    query: queries.ListFavoritesByUsername,
  })) as GraphQLResult<{ listFavoritesByUsername: FavoriteType[] }>;

  return queryResult.data?.listFavoritesByUsername ?? [];
};
