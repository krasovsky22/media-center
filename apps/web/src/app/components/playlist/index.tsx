import {
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Box,
  Container,
  Flex,
  Image,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { Loading } from '@youtube-player/components';

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
  children: React.ReactNode | React.ReactChildren;
};

const Playlist = ({ children, ...rest }: WithChildrenType) => {
  return (
    <Container textAlign="center" {...rest}>
      {children}
    </Container>
  );
};

Playlist.AccordionHeader = ({ children, ...rest }: WithChildrenType) => {
  return (
    <AccordionButton {...rest}>
      <Box flex="1" textAlign="left">
        {children}
      </Box>
      <AccordionIcon />
    </AccordionButton>
  );
};

Playlist.AccordionBody = ({ children, ...rest }: WithChildrenType) => {
  return (
    <AccordionPanel padding={0} {...rest}>
      <Box>{children}</Box>
    </AccordionPanel>
  );
};

Playlist.PlaylistVideoCard = ({
  video,
  ...rest
}: {
  video: YoutubePlaylistItem;
  onClick: () => void;
}) => {
  return (
    <Container
      cursor="pointer"
      marginY="1rem"
      className="max-h-14 flex gap-1 items-center content-center"
      {...rest}
    >
      <Image
        src={video.snippet.thumbnails?.default?.url}
        height="auto"
        width="auto"
        className="max-h-14"
      />
      <Box margin="auto" flex={4} overflow="auto">
        <Text
          whiteSpace="nowrap"
          wordBreak="break-word"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          {video.snippet.title}
        </Text>
      </Box>
    </Container>
  );
};

Playlist.Player = ({ videoId, ...rest }: { videoId: string }) => {
  const [isInitializing, setIsInitializing] = useState(false);
  useEffect(() => {
    setIsInitializing(true);
  }, [videoId]);
  return (
    <Box
      width="-moz-available"
      marginBottom="5"
      className="h-5/6 relative md:fixed"
    >
      {isInitializing && <Loading />}
      <ReactPlayer
        loop={true}
        stopOnUnmount={true}
        width="100%"
        height="100%"
        url={`https://www.youtube.com/watch?v=${videoId}`}
        controls
        onReady={() => setIsInitializing(false)}
        playing={true}
        {...rest}
      />
    </Box>
  );
};

export default Playlist;
