import { Accordion, AccordionItem, Box, Flex, Heading } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Loading } from '../components';
import Playlist, {
  YoutubePlaylistItem,
  YoutubePlaylistType,
} from '../components/playlist';
import { useServices } from '../context/services';

const YoutubePlaylistContainer: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  const [playlistItems, setPlaylistItems] = useState<
    Map<string, YoutubePlaylistItem[]>
  >(new Map());

  const [selectedVideo, setSelectedVideo] =
    useState<YoutubePlaylistItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { youtubeService, executeTokenRequest } = useServices();

  const addPlayListItem = useCallback(
    (id: string, itemsToAdd: YoutubePlaylistItem[]) => {
      if (!playlistItems.get(id)) {
        const newMap = new Map(playlistItems);
        newMap.set(id, itemsToAdd);
        setPlaylistItems(newMap);
      }
    },
    [playlistItems]
  );

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

  const accordionOnClick = useCallback(
    async (index: number) => {
      if (index < 0) return;
      const playlist = playlists[index] as YoutubePlaylistType;

      //never been opened => load items
      if (!playlistItems.get(playlist.id)) {
        setIsLoading(true);
        const fetchedPlaylistItems = await executeTokenRequest<
          YoutubePlaylistItem[]
        >(
          () =>
            youtubeService?.getPlaylistItem<YoutubePlaylistItem>(playlist.id) ??
            []
        );

        if (fetchedPlaylistItems) {
          const newPlaylistItems = new Map(playlistItems).set(
            playlist.id,
            fetchedPlaylistItems
          );

          setPlaylistItems(newPlaylistItems);
        }

        setIsLoading(false);
      }
    },
    [playlists, playlistItems]
  );

  return (
    <Flex className="w-full" justifyContent="center" gap={5}>
      {isLoading && <Loading />}
      <Playlist>
        <Accordion
          onChange={accordionOnClick}
          allowToggle
          className="flex flex-col gap-1"
        >
          {playlists.map((playlist) => (
            <AccordionItem key={playlist.id}>
              {({ isExpanded }) => (
                <>
                  <Playlist.AccordionHeader>
                    <Heading fontSize="md">{playlist.snippet.title}</Heading>
                  </Playlist.AccordionHeader>
                  {isExpanded && playlistItems.get(playlist.id) && (
                    <Playlist.AccordionBody>
                      {playlistItems.get(playlist.id)?.map((video) => (
                        <Playlist.PlaylistVideoCard
                          key={video.id}
                          video={video}
                          onClick={() => setSelectedVideo(video)}
                        />
                      ))}
                    </Playlist.AccordionBody>
                  )}
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </Playlist>
      <Box flexGrow={1} position="relative">
        {selectedVideo && (
          <Playlist.Player videoId={selectedVideo.snippet.resourceId.videoId} />
        )}
      </Box>
    </Flex>
  );
};

export default YoutubePlaylistContainer;
