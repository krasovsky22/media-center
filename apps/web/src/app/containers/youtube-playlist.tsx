import { Flex, Accordion, AccordionItem, Heading, Box } from '@chakra-ui/react';
import { Loading } from '@youtube-player/components';
import { useServices } from '@youtube-player/services';
import React, { useCallback, useEffect, useState } from 'react';
import { PlayListComponent, Carousel } from '../components';
import PlaylistContainer, { YoutubePlaylistType } from './playlist';
// import Playlist, {
//   YoutubePlaylistItem,
// } from '../components/playlist';

const YoutubePlaylistContainer: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  // const [playlistItems, setPlaylistItems] = useState<
  //   Map<string, YoutubePlaylistItem[]>
  // >(new Map());

  // const [selectedVideo, setSelectedVideo] =
  //   useState<YoutubePlaylistItem | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const { youtubeService } = useServices();

  // const addPlayListItem = useCallback(
  //   (id: string, itemsToAdd: YoutubePlaylistItem[]) => {
  //     if (!playlistItems.get(id)) {
  //       const newMap = new Map(playlistItems);
  //       newMap.set(id, itemsToAdd);
  //       setPlaylistItems(newMap);
  //     }
  //   },
  //   [playlistItems]
  // );

  //load playlists on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const data =
        (await youtubeService?.getPlaylists<YoutubePlaylistType>()) ?? [];
      if (data) {
        setPlaylists(data);
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeService]);

  // const accordionOnClick = useCallback(
  //   async (index: number) => {
  //     if (index < 0) return;
  //     const playlist = playlists[index] as YoutubePlaylistType;

  //     //never been opened => load items
  //     if (!playlistItems.get(playlist.id)) {
  //       setIsLoading(true);
  //       const fetchedPlaylistItems =
  //         (await youtubeService?.getPlaylistItem<YoutubePlaylistItem>(
  //           playlist.id
  //         )) ?? [];

  //       if (fetchedPlaylistItems) {
  //         const newPlaylistItems = new Map(playlistItems).set(
  //           playlist.id,
  //           fetchedPlaylistItems
  //         );

  //         setPlaylistItems(newPlaylistItems);
  //       }

  //       setIsLoading(false);
  //     }
  //   },
  //   [playlists, playlistItems]
  // );

  const activePlaylist = playlists[0];

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
              <PlayListComponent.BoxItem
                thumb_url={playlist.snippet.thumbnails.standard.url}
                title={playlist.snippet.title}
              />
            </Carousel.Element>
          ))}
        </Carousel>
      </Flex>
    </Flex>
  );
};

export default YoutubePlaylistContainer;
