import { Flex } from '@chakra-ui/react';
import { Loading } from '@youtube-player/components';
import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel, PlayListComponent } from '../components';
import { usePlayerPageStateState } from '../context/player-page';
import PlaylistContainer from './playlist';

const YoutubePlaylistContainer: React.FC = () => {
  const { isLoading, playlists, activePlaylist } = usePlayerPageStateState();

  return (
    <Flex
      className=""
      justifyContent="center"
      gap={5}
      flexDirection="column"
      flexGrow={1}
      paddingBottom="6"
    >
      {isLoading && <Loading />}
      <Flex flexGrow={1} flexDirection="column">
        {activePlaylist && <PlaylistContainer {...activePlaylist} />}
      </Flex>
      <Flex direction="column">
        <Carousel title="Playlists">
          {playlists.map((playlist) => (
            <Carousel.Element key={playlist.id}>
              <Link to={`/player/${playlist.id}`}>
                <PlayListComponent.BoxItem
                  thumb_url={playlist?.snippet?.thumbnails?.standard?.url ?? ''}
                  title={playlist?.snippet?.title ?? 'unknown'}
                />
              </Link>
            </Carousel.Element>
          ))}
        </Carousel>
      </Flex>
    </Flex>
  );
};

export default YoutubePlaylistContainer;
