import React, { useMemo } from 'react';
import { PlayListComponent } from '../components';
import { usePlayerPageStateState } from '../context/player-page';
import { YoutubePlaylistType } from '../youtube-playlist';
import PlaylistItemsTableContainer, {
  PlaylistItemDataType,
} from './playlist-items-table';

const Playlist: React.FC<YoutubePlaylistType> = ({ id, snippet }) => {
  const { playlistItems, playNextVideo } = usePlayerPageStateState();

  const tablePlaylistData: PlaylistItemDataType[] = useMemo(
    () =>
      playlistItems.map((playListItem, index) => ({
        id: playListItem?.snippet?.resourceId?.videoId ?? '',
        title: playListItem?.snippet.title ?? '',
        description: playListItem?.snippet.description ?? '',
        owner: playListItem?.snippet?.videoOwnerChannelTitle ?? '',
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
        <PlayListComponent.HeaderButtons
          count={tablePlaylistData.length}
          onClick={playNextVideo}
        />
      </PlayListComponent.Header>
      <PlayListComponent.Body>
        <PlaylistItemsTableContainer data={tablePlaylistData} />
      </PlayListComponent.Body>
    </PlayListComponent>
  );
};

export default Playlist;
