import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { HubCallback } from '@aws-amplify/core/lib/Hub';
import { googleAuthService } from '../services';
import { Credentials } from 'google-auth-library';
import { ROUTE_GOOGLE_CALLBACK } from '../routes';
import { useEnvVariables } from '../hooks';

//https://gist.github.com/groundedSAGE/995dc2e14845980fdc547c8ba510169c

Amplify.configure({
  aws_project_region: process.env.NX_REACT_APP_REGION,
  aws_cognito_identity_pool_id: process.env.NX_REACT_APP_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NX_REACT_APP_REGION,
  aws_user_pools_id: process.env.REACT_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NX_REACT_APP_CLIENT_ID,
  Auth: {
    identityPoolId: process.env.NX_REACT_APP_IDENTITY_POOL_ID,
    region: process.env.NX_REACT_APP_REGION,
    userPoolId: process.env.NX_REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.NX_REACT_APP_CLIENT_ID,
  },
});

interface IAuthContext {
  isInitializing: boolean;
  user: CognitoUser | null;
  login(username: string, password: string): Promise<CognitoUser | null>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;

  google?: ReturnType<typeof googleAuthService>;
  googleToken: Credentials | null;
}

const login = (username: string, password: string): Promise<CognitoUser> =>
  Auth.signIn(username, password);

const getSession = (): Promise<CognitoUserSession | null> =>
  Auth.currentSession();

const useGoogle = () => {
  const { app_host } = useEnvVariables();
  const appHostUrl = app_host.replace(/\/?$/, '/');
  const google = useMemo(
    () => googleAuthService(`${appHostUrl}${ROUTE_GOOGLE_CALLBACK}`),
    []
  );
  const [token, setTokens] = useState<Credentials | null>(google.token);

  useEffect(() => {
    google.subscribe(setTokens);

    return () => google.unsubscribeAll();
  }, []);

  console.log('asda', token);
  return { google, token };
};

const useCognito = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const authListener: HubCallback = ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        setUser(data);
        break;
      case 'signOut':
        setUser(null);
        break;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session && session.isValid()) {
          const user = await Auth.currentUserInfo();

          if (Object.values(user).length > 0) {
            setUser(user);
          }

          // const attributes = await Auth.userAttributes(user);
          // console.log('ATTR', attributes);
        }
      } catch (error) {
        console.error(error.message);
      }

      setIsInitializing(false);
    })();
  }, []);

  useEffect(() => {
    Hub.listen('auth', authListener);
    return () => Hub.remove('auth', authListener);
  }, []);

  return { user, login, isInitializing };
};

const AuthContext = createContext<IAuthContext>({
  isInitializing: true,
  user: null,
  login,
  isLoggedIn: false,
  logout: async () => {
    return;
  },
  googleToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useCognito();
  const { google, token } = useGoogle();

  const isLoggedIn = useMemo(() => {
    return auth.user !== null && token !== null;
  }, [auth.user, token]);

  const logout = useCallback(async () => {
    await Promise.all([Auth.signOut(), google?.destroySession()]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...auth, google, logout, isLoggedIn, googleToken: token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
