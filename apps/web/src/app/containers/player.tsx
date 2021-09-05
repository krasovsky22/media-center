import { Box } from '@chakra-ui/react';
import { Loading } from '@youtube-player/components';
import React, { useEffect, useState, Suspense } from 'react';
import { usePlayerPageStateState } from '../context/player-page';
const ReactPlayer = React.lazy(() => import('react-player/youtube'));

const Player: React.FC = () => {
  const { activeVideoId, playNextVideo } = usePlayerPageStateState();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
  }, [activeVideoId]);

  return (
    <Suspense fallback={<Loading />}>
      <Box position="fixed" bottom={10} right={10}>
        <ReactPlayer
          url={`https://www.youtube.com/watch?v=${activeVideoId}`}
          width="100%"
          fallback={<Loading />}
          height="20vh"
          onReady={() => setIsPlaying(true)}
          onEnded={playNextVideo}
          playing={isPlaying}
        />
      </Box>
    </Suspense>
  );
};

export default Player;
