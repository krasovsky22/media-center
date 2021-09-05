import { Box } from '@chakra-ui/react';
import React from 'react';
import { Navbar } from '../components';
import { YoutubePlaylistContainer, PlayerContainer } from '../containers';
import { SharedPlayerPageProvider } from '../context/player-page';

const PlayerPage: React.FC = () => {
  return (
    <SharedPlayerPageProvider>
      <Navbar />
      <Box className="px-32 flex-grow flex flex-col">
        <YoutubePlaylistContainer />
      </Box>
      <PlayerContainer />
    </SharedPlayerPageProvider>
  );
};

export default PlayerPage;
