import { Box } from '@chakra-ui/react';
import { Disclosure } from '@headlessui/react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Loading } from '..';
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
    resourceId: { kind: string; videoId: string };
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
        <Box
          className="rounded-md shadow-md overflow-hidden md:max-w-2xl relative w-full m-0"
          backgroundColor="yellow.300"
        >
          <div className="flex items-center flex-shrink-1 rounded-xl p-5">
            <Disclosure.Button>
              <img
                className="w-full object-cover rounded-md"
                src={playlist.snippet.thumbnails.default.url}
                height={playlist.snippet.thumbnails.default.height}
                width={playlist.snippet.thumbnails.default.width}
                alt="A cat"
              />
            </Disclosure.Button>
            <div className="flex-grow w-full align-middle  text-center justify-center">
              <Disclosure.Button className="text-lg w-full">
                {playlist.snippet.title}
              </Disclosure.Button>
            </div>
          </div>
          <Disclosure.Panel className="flex-grow bg-gray-300" unmount={false}>
            {children(open)}
          </Disclosure.Panel>
        </Box>
      )}
    </Disclosure>
  );
};

PlayList.Content = ({ playlistId, isOpen = false }: PlaylistContentType) => {
  const [playlistVideos, setPlaylistVideos] = useState<YoutubePlaylistItem[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const { youtubeService, executeTokenRequest } = useServices();

  useEffect(() => {
    if (isOpen && playlistVideos.length === 0) {
      (async () => {
        const playlistItems = await executeTokenRequest<YoutubePlaylistItem[]>(
          () =>
            youtubeService?.getPlaylistItem<YoutubePlaylistItem>(playlistId) ??
            []
        );

        if (playlistItems) {
          setPlaylistVideos(playlistItems);
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
          <ReactPlayer
            loop={true}
            stopOnUnmount={true}
            height={60}
            width="auto"
            url={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}`}
            controls
          ></ReactPlayer>
        </div>
      ))}
    </div>
  );
};

export default PlayList;
