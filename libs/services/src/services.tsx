import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { youtubeServiceFactory } from './factories';
import { useAuth } from '@youtube-player/auth';

type ServicesContextType = {
  youtubeService?: ReturnType<typeof youtubeServiceFactory>;
};

const ServicesContext = createContext<ServicesContextType>({});

/**
 * use executeTokenRequest method to handle access_tokens automatically
 */
export function useServices() {
  return useContext(ServicesContext);
}

type ServiceProviderTypes = {
  children: React.ReactChild | React.ReactChildren;
};
export function ServicesProvider({ children }: ServiceProviderTypes) {
  const { youtubeRefreshToken } = useAuth();

  const youtubeService = useMemo(() => {
    return youtubeServiceFactory(youtubeRefreshToken);
  }, [youtubeRefreshToken]);

  return (
    <ServicesContext.Provider value={{ youtubeService }}>
      {children}
    </ServicesContext.Provider>
  );
}
