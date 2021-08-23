import { useServices } from '@youtube-player/services';
import React, { useState, useEffect, useMemo } from 'react';
import { PlayListComponent } from '../components';
import PlaylistItemsTableContainer, {
  PlaylistItemDataType,
} from './playlist-items-table';

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

type YoutubePlaylistItem = {
  etag: string;
  id: string;
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
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

const Playlist: React.FC<YoutubePlaylistType> = ({ id, snippet }) => {
  const [playlistItems, setPlaylistItems] = useState<YoutubePlaylistItem[]>([]);
  const { youtubeService } = useServices();

  useEffect(() => {
    (async () => {
      //setIsLoading(true);
      const fetchedPlaylistItems =
        (await youtubeService?.getPlaylistItem<YoutubePlaylistItem>(id)) ?? [];

      setPlaylistItems(fetchedPlaylistItems);
    })();
  }, [id]);

  console.log(playlistItems);

  const tablePlaylistData: PlaylistItemDataType[] = useMemo(
    () =>
      playlistItems.map((playListItem, index) => ({
        id: `${index}`,
        title: playListItem?.snippet.title ?? '',
        description: playListItem?.snippet.description ?? '',
        time: '2:34',
        thumbnail_url: playListItem?.snippet.thumbnails.standard.url ?? '',
      })),
    [playlistItems]
  );

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
      <PlayListComponent.Body>
        <PlaylistItemsTableContainer data={tablePlaylistData} />
      </PlayListComponent.Body>
    </PlayListComponent>
  );
};

export default Playlist;
