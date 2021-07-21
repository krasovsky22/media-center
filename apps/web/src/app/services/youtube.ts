import axios from 'axios';

export type YoutubePlaylistType = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    localized: {
      title: string;
      description: string;
    };
    publishedAt: string;
    title: string;
  };
};

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
    async getPlaylists(): Promise<YoutubePlaylistType[]> {
      try {
        const { data } = await client.get('playlists');

        return (data?.items ?? []) as YoutubePlaylistType[];
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

    async getPlaylistItem(playlistId: string) {
      try {
        const { data } = await client.get('playlists', {
          params: {
            playlistId,
          },
        });

        console.log(data);

        return data.items;
      } catch (e) {
        console.error(e.message);
      }
    },
  };
};

export default youtubeServiceFactory;
