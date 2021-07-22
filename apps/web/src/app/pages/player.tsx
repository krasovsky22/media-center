import React from 'react';
import { Navbar } from '../components';
import { YoutubePlaylistContainer } from '../containers';

const PlayerPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main className="p-5">
        <YoutubePlaylistContainer />
      </main>
    </>
  );
};

export default PlayerPage;
