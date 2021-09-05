import { useServices } from '@youtube-player/services';
import React, {
  useCallback,
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useParams } from 'react-router-dom';
import { default as Queries } from '../queries/player';
import { YoutubePlaylistItem, YoutubePlaylistType } from '../youtube-playlist';

type PlayerPageStateType = {
  isLoading: boolean;
  activeVideoId: string | null;
  setActiveVideoId: (arg: string | null) => void;
  playlists: YoutubePlaylistType[];
  activePlaylist?: YoutubePlaylistType;
  playlistItems: YoutubePlaylistItem[];
};

const initialState: PlayerPageStateType = {
  playlists: [],
  playlistItems: [],
  isLoading: false,
  activeVideoId: null,
  setActiveVideoId: () => {
    return null;
  },
};

const MyContext = createContext<PlayerPageStateType>(initialState);

export const usePlayerPageStateState = () => {
  const value = useContext(MyContext);
  if (value === null) throw new Error('Please add SharedStateProvider');
  return value;
};

export const SharedPlayerPageProvider: React.FC = ({ children }) => {
  const { id: playlistId = null } = useParams<{ id?: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const { youtubeService } = useServices();

  const { data: playlists = [], isLoading: isPlaylistsLoading } =
    Queries.fetchPlaylists<YoutubePlaylistType>(youtubeService);

  const { data: playlistItems = [], isLoading: isPlaylistsItemsLoading } =
    Queries.fetchPlaylistItems(playlistId ?? '', youtubeService);

  const activePlaylist = useMemo(() => {
    if (playlistId === null) {
      return playlists[0];
    }

    return playlists.find((playlist) => playlist.id === playlistId);
  }, [playlists, playlistId]);

  useEffect(() => {
    setIsLoading(isPlaylistsLoading || isPlaylistsItemsLoading);
  }, [isPlaylistsLoading, isPlaylistsItemsLoading]);

  return (
    <MyContext.Provider
      value={{
        isLoading,
        playlists,
        activePlaylist,
        activeVideoId,
        setActiveVideoId,
        playlistItems,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
