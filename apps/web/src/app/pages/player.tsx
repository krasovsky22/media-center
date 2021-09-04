import { Box } from '@chakra-ui/react';
import React from 'react';
import { Navbar } from '../components';
import { YoutubePlaylistContainer } from '../containers';

const PlayerPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Box className="px-32 flex-grow flex flex-col">
        <YoutubePlaylistContainer />
      </Box>
    </>
  );
};

export default PlayerPage;
