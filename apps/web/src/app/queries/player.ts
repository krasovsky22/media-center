import { YoutubeServiceType } from '@youtube-player/services';
import { useQuery } from 'react-query';

const fetchPlaylists = <T>(service?: YoutubeServiceType) =>
  useQuery('fetch-youtube-playlists', () => service?.getPlaylists<T>());

const fetchPlaylistItems = <T>(
  playlistId: string,
  service?: YoutubeServiceType
) =>
  useQuery(['fetch-youtube-playlists-videos', playlistId], () =>
    service?.getPlaylistItem<T>(playlistId)
  );

export default { fetchPlaylists, fetchPlaylistItems };
