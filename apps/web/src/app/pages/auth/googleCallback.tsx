import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Loading } from '../../components';
import { useAuth } from '../../context/auth';
import useQuery from '../../hooks/useQuery';
import { ROUTE_PLAYER } from '../../routes';

const GoogleCallbackPage = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  const history = useHistory();

  const code = useQuery().get('code');
  const { google } = useAuth();

  useEffect(() => {
    (async () => {
      if (code && google) {
        await google.processCallbackCode(code);

        setIsInitializing(false);
      }
    })();
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
