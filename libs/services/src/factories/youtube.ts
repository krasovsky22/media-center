import axios from 'axios';
import googleAuthService from '../clients/google';
import { useEnvVariables } from '@youtube-player/hooks';

const youtubeServiceFactory = (refreshToken: string | null) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { youtube_api_key } = useEnvVariables();

  const googleClient = googleAuthService(refreshToken);

  const axiosClient = async () => {
    const requestHeaders = await googleClient.getRequestHeaders();

    return axios.create({
      baseURL: 'https://www.googleapis.com/youtube/v3/',
      params: {
        part: 'snippet',
        maxResults: 25,
        mine: true,
        key: youtube_api_key,
      },
      headers: {
        Accept: 'application/json',
        ...requestHeaders,
      },
    });
  };

  return {
    async getPlaylists<T>(): Promise<T[]> {
      try {
        const client = await axiosClient();
        const { data } = await client.get('playlists');

        return (data?.items ?? []) as T[];
      } catch (error) {
        if (error.response) {
          // Request made and server responded
          throw error.response;
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error: ', error.message);
        }
      }

      return [];
    },

    async getPlaylistItem<T>(playlistId: string): Promise<T[]> {
      try {
        const client = await axiosClient();
        const { data } = await client.get('playlistItems', {
          params: {
            playlistId,
          },
        });
        return data.items as T[];
      } catch (e) {
        console.error(e.message);
      }

      return [];
    },

    get refreshToken() {
      return refreshToken;
    },

    get googleClient() {
      return googleClient;
    },
  };
};

export default youtubeServiceFactory;
