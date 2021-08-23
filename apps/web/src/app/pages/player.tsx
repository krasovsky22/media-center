import { Container } from '@chakra-ui/react';
import React from 'react';
import { Navbar } from '../components';
import { YoutubePlaylistContainer } from '../containers';

const PlayerPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Container maxW="container.lg" className="px-32 flex-grow flex flex-col">
        <YoutubePlaylistContainer />
      </Container>
    </>
  );
};

export default PlayerPage;
