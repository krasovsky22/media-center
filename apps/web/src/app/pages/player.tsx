import { Disclosure } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import { Loading, Navbar } from '../components';
import { useAuth } from '../context/auth';
import { useServices } from '../context/services';

type ThumbnailType = {
  height: number;
  url: string;
  width: number;
};

type YoutubePlaylistType = {
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
    thumbnails: {
      default: ThumbnailType;
      high: ThumbnailType;
      maxres: ThumbnailType;
      defamediumult: ThumbnailType;
      standard: ThumbnailType;
    };
    title: string;
  };
};

type YoutubePlaylistItem = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    localized: {
      description: string;
      title: string;
    };
    publishedAt: string;
    thumbnails: {
      default: ThumbnailType;
      high: ThumbnailType;
      maxres: ThumbnailType;
      defamediumult: ThumbnailType;
      standard: ThumbnailType;
    };
    title: string;
  };
};

type PlaylistContentType = {
  isOpen?: boolean;
  playlistId: string;
};

const PlaylistContent = ({
  playlistId,
  isOpen = false,
}: PlaylistContentType) => {
  const [playlistVideos, setPlaylistVideos] = useState<YoutubePlaylistItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { google } = useAuth();
  const { youtubeService } = useServices();

  useEffect(() => {
    if (isOpen && playlistVideos.length === 0) {
      (async () => {
        try {
          const playlistItems =
            (await youtubeService?.getPlaylistItem<YoutubePlaylistItem>(
              playlistId
            )) ?? [];
          setPlaylistVideos(playlistItems);
        } catch (e) {
          console.error('ERROR', e);
          google?.refreshToken();
        }

        setIsLoading(false);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, playlistId]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-5 text-gray-500 flex flex-col w-full gap-1">
      {playlistVideos.map((video) => (
        <div key={video.id} className="p-5 border-2">
          {video.snippet.title}
        </div>
      ))}
    </div>
  );
};

const Playlist = (playlist: YoutubePlaylistType) => {
  return (
    <Disclosure>
      {({ open }) => (
        <div className="max-w-md  bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl relative">
          <div className="md:flex items-center">
            <div className="md:flex-shrink-0">
              <Disclosure.Button>
                <img
                  className="w-full object-cover"
                  src={playlist.snippet.thumbnails.default.url}
                  height={playlist.snippet.thumbnails.default.height}
                  width={playlist.snippet.thumbnails.default.width}
                  alt="A cat"
                />
              </Disclosure.Button>
            </div>
            <div className="flex-grow w-full align-middle  text-center justify-center">
              <Disclosure.Button className="text-lg w-full">
                {playlist.snippet.title}
              </Disclosure.Button>
            </div>
          </div>
          <Disclosure.Panel className="flex-grow " unmount={false}>
            <PlaylistContent playlistId={playlist.id} isOpen={open} />
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

const PlayerPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { google } = useAuth();
  const { youtubeService } = useServices();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data =
          (await youtubeService?.getPlaylists<YoutubePlaylistType>()) ?? [];
        setPlaylists(data);
      } catch (e) {
        console.error('ERROR', e);
        google?.refreshToken();
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeService]);

  console.log(playlists);

  return (
    <>
      <Navbar />
      <main className="p-5">
        {isLoading && <Loading />}
        <div className="flex flex-col gap-1">
          {playlists.map((playlist) => (
            <Playlist key={playlist.id} {...playlist} />
          ))}
        </div>
      </main>
    </>
  );
};

export default PlayerPage;
