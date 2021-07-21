import React, { createContext, useContext, useMemo } from 'react';
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

  const youtubeService = useMemo(() => {
    const accessToken = googleToken?.access_token ?? '';

    return youtubeServiceFactory(
      process.env.NX_REACT_APP_YOUTUBE_API_KEY ?? '',
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
