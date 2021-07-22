import React, { useEffect, useState } from 'react';
import { Loading } from '../components';
import PlayList, { YoutubePlaylistType } from '../components/playlist';
import { useAuth } from '../context/auth';
import { useServices } from '../context/services';

const YoutubePlaylistContainer: React.FC = () => {
  const [playlists, setPlaylists] = useState<YoutubePlaylistType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { google } = useAuth();
  const { youtubeService } = useServices();

  //load playlists on mount
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data =
          (await youtubeService?.getPlaylists<YoutubePlaylistType>()) ?? [];
        setPlaylists(data);
      } catch (e) {
        console.error('ERROR', e);
        google?.refreshToken();
      }

      setIsLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youtubeService]);

  return (
    <>
      {isLoading && <Loading />}
      <div className="flex flex-col gap-1">
        {playlists.map((playlist) => (
          <PlayList key={playlist.id} {...playlist}>
            {(isOpen) => (
              <PlayList.Content playlistId={playlist.id} isOpen={isOpen} />
            )}
          </PlayList>
        ))}
      </div>
    </>
  );
};

export default YoutubePlaylistContainer;
