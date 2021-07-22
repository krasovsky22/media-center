import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useEnvVariables } from '../hooks';
import { youtubeServiceFactory } from '../services';
import { useAuth } from './auth';

type ServicesContextType = {
  youtubeService?: ReturnType<typeof youtubeServiceFactory>;
  executeTokenRequest: <T>(arg: () => unknown) => Promise<T | null>;
};

const ServicesContext = createContext<ServicesContextType>({
  executeTokenRequest: async () => {
    return null;
  },
});

/**
 * use executeTokenRequest method to handle access_tokens automatically
 */
export function useServices() {
  return useContext(ServicesContext);
}

type withChildren = {
  children: React.ReactChild | React.ReactChildren;
};
export function ServicesProvider({ children }: withChildren) {
  const { isLoggedIn, googleToken, google } = useAuth();
  const { youtube_api_key } = useEnvVariables();

  const youtubeService = useMemo(() => {
    const accessToken = googleToken?.access_token ?? '';

    return youtubeServiceFactory(youtube_api_key, accessToken);
  }, [googleToken?.access_token, youtube_api_key]);

  const executeTokenRequest = useCallback(async (callback) => {
    try {
      return await callback();
    } catch (e) {
      console.error('ERROR', e);
      google?.refreshToken();
    }
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <ServicesContext.Provider value={{ youtubeService, executeTokenRequest }}>
      {children}
    </ServicesContext.Provider>
  );
}
