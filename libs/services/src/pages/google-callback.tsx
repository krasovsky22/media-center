import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '@youtube-player/components';
import { useQuery } from '@youtube-player/hooks';
import { useAuth } from '@youtube-player/auth';
import { useServices } from '..';

const GoogleCallbackPage = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState('');
  const { youtubeService } = useServices();
  const { user, updateGoogleRefreshToken } = useAuth();

  const code = useQuery('code') as string;

  useEffect(() => {
    (async () => {
      const googleClient = youtubeService?.googleClient;
      if (code && googleClient) {
        try {
          const googleTokenResponse = await googleClient.processCallbackCode(
            code
          );

          const {
            tokens: { refresh_token },
          } = googleTokenResponse;

          console.log(refresh_token, googleTokenResponse);
          if (refresh_token) {
            //save refresh token as cognito attribute
            const success = updateGoogleRefreshToken(refresh_token);
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
          setError(e?.message);
        }

        setIsInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isInitializing) {
    return (
      <Redirect
        to={{
          pathname: '/',
        }}
      />
    );
  }

  return <Loading />;
};

export default GoogleCallbackPage;
