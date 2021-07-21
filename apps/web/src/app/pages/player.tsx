import React, { useState, useEffect } from 'react';
import { Navbar } from '../components';
import { useAuth } from '../context/auth';
import { useServices } from '../context/services';

import { YoutubePlaylistType } from '../services/youtube';
const Playlist = ({ playlistId }: { playlistId: string }) => {
  return <div>{playlistId}</div>;
};

const DashboardPage: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  const { youtubeService } = useServices();

  useEffect(() => {
    (async () => {
      try {
        const data = (await youtubeService?.getPlaylists()) ?? [];
        setPlaylists(data);
      } catch (e) {
        console.error('ERROR', e);
      }
    })();
  }, []);

  console.log(playlists);

  return (
    <>
      <Navbar />
      <main>
        <div className="container">Container here</div>
        <ul>
          {playlists.map((playlist) => (
            <Playlist key={playlist.id} playlistId={playlist.id} />
          ))}
        </ul>
      </main>
    </>
  );
};

export default DashboardPage;
