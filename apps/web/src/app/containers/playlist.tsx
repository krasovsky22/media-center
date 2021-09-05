import { Loading } from '@youtube-player/components';
import { useServices } from '@youtube-player/services';
import React, { useState, useEffect, useMemo } from 'react';
import { PlayListComponent } from '../components';
import { usePlayerPageStateState } from '../context/player-page';
import { YoutubePlaylistItem, YoutubePlaylistType } from '../youtube-playlist';
import PlaylistItemsTableContainer, {
  PlaylistItemDataType,
} from './playlist-items-table';

const Playlist: React.FC<YoutubePlaylistType> = ({ id, snippet }) => {
  const { playlistItems } = usePlayerPageStateState();

  const tablePlaylistData: PlaylistItemDataType[] = useMemo(
    () =>
      playlistItems.map((playListItem, index) => ({
        id: playListItem?.snippet?.resourceId?.videoId ?? '',
        title: playListItem?.snippet.title ?? '',
        description: playListItem?.snippet.description ?? '',
        time: '2:34',
        thumbnail_url: playListItem?.snippet?.thumbnails?.standard?.url ?? '',
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
        <PlayListComponent.HeaderButtons count={tablePlaylistData.length} />
      </PlayListComponent.Header>
      <PlayListComponent.Body>
        <PlaylistItemsTableContainer data={tablePlaylistData} />
      </PlayListComponent.Body>
    </PlayListComponent>
  );
};

export default Playlist;
