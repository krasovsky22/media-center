import { Flex, Grid, HStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import PlayList, { YoutubePlaylistType } from '../components/playlist';
import { useServices } from '../context/services';

const YoutubePlaylistContainer: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { youtubeService, executeTokenRequest } = useServices();

  //load playlists on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data = await executeTokenRequest<YoutubePlaylistType[]>(
        () => youtubeService?.getPlaylists<YoutubePlaylistType>() ?? []
      );
      if (data) {
        setPlaylists(data);
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeService]);

  return (
    <>
      {isLoading && <Loading />}
      <Flex
        flexWrap="wrap"
        justifyContent="space-around"
        alignItems="baseline"
        className="flex-none gap-4"
      >
        {playlists.map((playlist) => (
          <PlayList key={playlist.id} {...playlist}>
            {(isOpen) => (
              <PlayList.Content playlistId={playlist.id} isOpen={isOpen} />
            )}
          </PlayList>
        ))}
      </Flex>
    </>
  );
};

export default YoutubePlaylistContainer;
