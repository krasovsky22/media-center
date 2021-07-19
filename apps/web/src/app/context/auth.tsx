import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import Amplify, { Auth, Hub } from 'aws-amplify';
import { CognitoUser } from '@aws-amplify/auth';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { HubCallback } from '@aws-amplify/core/lib/Hub';

interface IAuthContext {
  user: CognitoUser | null;
  login(username: string, password: string): Promise<CognitoUser | null>;
  logout(): ReturnType<typeof Auth.signOut>;
}

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

const login = (username: string, password: string): Promise<CognitoUser> =>
  Auth.signIn(username, password);

const logout = (): Promise<unknown> => Auth.signOut();

const getSession = (): Promise<CognitoUserSession | null> =>
  Auth.currentSession();

const useCognito = () => {
  const [user, setUser] = useState<CognitoUser | null>(null);
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
          setUser(user);
          console.log('fetched', user);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    Hub.listen('auth', authListener);
    return () => Hub.remove('auth', authListener);
  }, []);

  return { user, login, logout };
};

const AuthContext = createContext<IAuthContext>({
  user: null,
  login,
  logout,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useCognito();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
