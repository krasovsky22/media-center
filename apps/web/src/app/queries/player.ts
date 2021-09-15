import { YoutubeServiceType } from '@youtube-player/services';
import { fetchFavorites, createFavorite } from '@youtube-player/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { YoutubePlaylistItem } from '../youtube-playlist';

const fetchPlaylists = <T>(service?: YoutubeServiceType) =>
  useQuery('fetch-youtube-playlists', () => service?.getPlaylists<T>());

const fetchPlaylistItems = <T extends YoutubePlaylistItem>(
  playlistId: string,
  service?: YoutubeServiceType
) => {
  const { isLoading: isYoutubeLoading, data: playlistItems } = useQuery(
    ['fetch-youtube-playlists-videos', playlistId],
    () => service?.getPlaylistItem<T>(playlistId)
  );

  const { isLoading: isApiLoading, data: favorites } = useQuery(
    'fetch-video-saved-favorites',
    fetchFavorites
  );

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
    (playlistItem: T): ReturnType<typeof createFavorite> => {
      if (playlistItem.isFavorite) {
        return createFavorite({
          source: 'youtube',
          videoId: playlistItem.id ?? '',
        });
      } else {
        return createFavorite({
          source: 'youtube',
          videoId: playlistItem.id ?? '',
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('fetch-video-saved-favorites');
      },
    }
  );
};

export default { fetchPlaylists, fetchPlaylistItems, addOrRemoveFavorite };
