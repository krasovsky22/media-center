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
import Loading from '../loading';

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
    <AccordionPanel {...rest}>
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
    <Container cursor="pointer" marginBottom="1rem" {...rest}>
      <Flex gap={1} alignItems="center" alignContent="center">
        <Image
          src={video.snippet.thumbnails?.default?.url}
          height={video.snippet.thumbnails?.default?.height}
          width={video.snippet.thumbnails?.default?.width}
        />
        <Box flexGrow={1} margin="auto">
          <Text fontSize="md">{video.snippet.title}</Text>
        </Box>
      </Flex>
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
      position="fixed"
      width="-moz-available"
      marginBottom="5"
      className="h-5/6"
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
