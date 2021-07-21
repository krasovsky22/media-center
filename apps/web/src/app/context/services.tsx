import React, { createContext, useContext, useMemo } from 'react';
import { useEnvVariables } from '../hooks';
import { youtubeServiceFactory } from '../services';
import { useAuth } from './auth';

type ServicesContextType = {
  youtubeService?: ReturnType<typeof youtubeServiceFactory>;
};
const ServicesContext = createContext<ServicesContextType>({});

export function useServices() {
  return useContext(ServicesContext);
}

type withChildren = {
  children: React.ReactChild | React.ReactChildren;
};
export function ServicesProvider({ children }: withChildren) {
  const { isLoggedIn, googleToken } = useAuth();
  const { youtube_api_key } = useEnvVariables()

  const youtubeService = useMemo(() => {
    console.log('creating new', googleToken);
    const accessToken = googleToken?.access_token ?? '';

    return youtubeServiceFactory(
      youtube_api_key,
      accessToken
    );
  }, [googleToken]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ServicesContext.Provider value={{ youtubeService }}>
      {children}
    </ServicesContext.Provider>
  );
}
