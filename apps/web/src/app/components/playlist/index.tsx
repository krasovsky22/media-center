import React, { useEffect, useState } from 'react';
import { Disclosure } from '@headlessui/react';
import { Loading } from '..';
import { useAuth } from '../../context/auth';
import { useServices } from '../../context/services';

export type ThumbnailType = {
  height: number;
  url: string;
  width: number;
};

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

export type YoutubePlaylistItem = {
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

export type PlaylistContentType = {
  playlistId: string;
  isOpen?: boolean;
};

type WithChildrenType = {
  children: (arg: boolean) => React.ReactNode;
};

const PlayList = ({
  children,
  ...playlist
}: YoutubePlaylistType & WithChildrenType) => {
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
            {children(open)}
          </Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  );
};

PlayList.Content = ({ playlistId, isOpen = false }: PlaylistContentType) => {
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

export default PlayList;
