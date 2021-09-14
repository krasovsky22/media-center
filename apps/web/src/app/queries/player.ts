import { YoutubeServiceType } from '@youtube-player/services';
import { fetchFavorites } from '@youtube-player/api';
import { useQuery } from 'react-query';
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
    ['fetch-video-saved-favorites'],
    fetchFavorites
  );

  if (playlistItems && favorites) {
    favorites.forEach((favorite) => {
      const playlistItemIndex = playlistItems?.findIndex(
        (playlistItem) => playlistItem.id === favorite.videoId
      );

      if (playlistItemIndex >= 0) {
        //set isFavorite to be true
        playlistItems[playlistItemIndex] = {
          ...playlistItems[playlistItemIndex],
          isFavorite: true,
        };
      }
    });
  }

  return { isLoading: isYoutubeLoading || isApiLoading, data: playlistItems };
};

export default { fetchPlaylists, fetchPlaylistItems };
