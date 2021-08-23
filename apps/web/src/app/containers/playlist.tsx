import { Avatar, Box, Flex, Image } from '@chakra-ui/react';
import React from 'react';
import { PlayListComponent } from '../components';

type PlaylistType = {
  thumbnail: string;
  title: string;
};

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

const Playlist: React.FC<YoutubePlaylistType> = ({ snippet }) => {
  console.log(snippet);
  return (
    <PlayListComponent>
      <PlayListComponent.Header>
        <PlayListComponent.ProfileSection
          url={snippet.thumbnails.high.url}
          name={snippet.title}
        />
        <PlayListComponent.DescriptionSection
          source="youtube"
          title={snippet.title}
          description={snippet.description}
        />
        <PlayListComponent.HeaderButtons />
      </PlayListComponent.Header>
      <PlayListComponent.Body>Playlist Body</PlayListComponent.Body>
    </PlayListComponent>
  );
};

export default Playlist;
