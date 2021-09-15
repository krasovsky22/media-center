import { useMemo } from 'react';
import { YoutubeServiceType } from '@youtube-player/services';
import {
  fetchFavorites,
  createFavorite,
  deleteFavorite,
} from '@youtube-player/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { YoutubePlaylistItem } from '../youtube-playlist';

const fetchPlaylists = <T>(service?: YoutubeServiceType) =>
  useQuery('fetch-youtube-playlists', () => service?.getPlaylists<T>());

const fetchPlaylistItems = <T extends YoutubePlaylistItem>(
  playlistId: string,
  service?: YoutubeServiceType
) => {
  const { isLoading: isYoutubeLoading, data: playlistFetchedItems } = useQuery(
    ['fetch-youtube-playlists-videos', playlistId],
    () => service?.getPlaylistItem<T>(playlistId)
  );

  const { isLoading: isApiLoading, data: favorites } = useQuery(
    ['fetch-video-saved-favorites'],
    fetchFavorites
  );

  //reset playlistItems when favorites change
  const playlistItems = useMemo(() => {
    return playlistFetchedItems?.map((item) => {
      const clonedItem = {
        ...item,
        isFavorite: false,
      };
      delete clonedItem.favoriteId;
      return clonedItem;
    });
  }, [playlistFetchedItems, favorites]);

  if (playlistItems?.length && favorites?.length) {
    favorites.forEach((favorite) => {
      const playlistItemIndex = playlistItems?.findIndex(
        (playlistItem) =>
          playlistItem?.snippet?.resourceId?.videoId === favorite.videoId
      );

      if (playlistItemIndex >= 0) {
        //set isFavorite to be true
        playlistItems[playlistItemIndex] = {
          ...playlistItems[playlistItemIndex],
          isFavorite: true,
          favoriteId: favorite.id,
        };
      }
    });

    playlistItems.sort(
      (prev, next) => +(next?.isFavorite ?? 0) - +(prev?.isFavorite ?? 0)
    );
  }

  return {
    isLoading: isYoutubeLoading || isApiLoading,
    data: playlistItems,
  };
};

const addOrRemoveFavorite = <T extends Partial<YoutubePlaylistItem>>() => {
  const queryClient = useQueryClient();

  return useMutation(
    async (playlistItem: T): ReturnType<typeof createFavorite> => {
      if (playlistItem.isFavorite) {
        if (playlistItem.favoriteId) {
          deleteFavorite(playlistItem.favoriteId);
        }
      } else {
        return createFavorite({
          source: 'youtube',
          videoId: playlistItem.id ?? '',
        });
      }
      return null;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetch-video-saved-favorites');
      },
    }
  );
};

export default { fetchPlaylists, fetchPlaylistItems, addOrRemoveFavorite };
