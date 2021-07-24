import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Loading } from '../../components';
import { useAuth } from '../../context/auth';
import { useQuery } from '../../hooks';
import { ROUTE_PLAYER } from '../../routes';

const GoogleCallbackPage = () => {
  const [isInitializing, setIsInitializing] = useState(true);

  const code = useQuery('code') as string;
  const { google } = useAuth();

  useEffect(() => {
    (async () => {
      if (code && google) {
        await google.processCallbackCode(code);

        setIsInitializing(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (!isInitializing) {
    return (
      <Redirect
        to={{
          pathname: ROUTE_PLAYER,
        }}
      />
    );
  }

  return <Loading />;
};

export default GoogleCallbackPage;
