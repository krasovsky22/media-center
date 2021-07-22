import axios from 'axios';

const youtubeServiceFactory = (apiKey: string, accessToken: string) => {
  const client = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    params: {
      part: 'snippet',
      maxResults: 25,
      mine: true,
      key: apiKey,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  return {
    async getPlaylists<T>(): Promise<T[]> {
      try {
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
  };
};

export default youtubeServiceFactory;
