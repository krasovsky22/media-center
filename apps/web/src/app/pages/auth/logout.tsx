import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '@youtube-player/auth';
import { useServices } from '@youtube-player/services';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const { youtubeService } = useServices();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        await logout();
      } catch (e) {
        console.error(e);
      }
      history.push('/');
    })();
  }, []);

  return null;
};

export default LogoutPage;
