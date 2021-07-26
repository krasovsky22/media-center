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
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { HubCallback } from '@aws-amplify/core/lib/Hub';

//https://gist.github.com/groundedSAGE/995dc2e14845980fdc547c8ba510169c
Amplify.configure({
  aws_project_region: process.env.NX_REACT_APP_REGION,
  aws_cognito_identity_pool_id: process.env.NX_REACT_APP_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NX_REACT_APP_REGION,
  aws_user_pools_id: process.env.REACT_APP_USER_POOL_ID,
  aws_user_pools_web_client_id: process.env.NX_REACT_APP_CLIENT_ID,
  Auth: {
    // identityPoolId: process.env.NX_REACT_APP_IDENTITY_POOL_ID,
    region: process.env.NX_REACT_APP_REGION,
    userPoolId: process.env.NX_REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.NX_REACT_APP_CLIENT_ID,
  },
});

type CognitoUserType = {
  username: string;
  attributes: Record<string, string>;
};

const cognitoSignUp = async (
  username: string,
  password: string,
  email: string
) => await Auth.signUp({ username, password, attributes: { email } });

const confirmSignUp = async (username: string, code: string) => {
  await Auth.confirmSignUp(username, code);
};

const login = (username: string, password: string): Promise<CognitoUserType> =>
  Auth.signIn(username, password);

const getSession = (): Promise<CognitoUserSession | null> =>
  Auth.currentSession();

interface IAuthContext {
  isInitializing: boolean;
  user: CognitoUserType | null;
  signUp(username: string, password: string, email: string): Promise<void>;
  confirmSignUp(
    username: string,
    code: string
  ): ReturnType<typeof confirmSignUp>;
  login(username: string, password: string): Promise<CognitoUserType | null>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  updateGoogleRefreshToken(arg: string): void;
  youtubeRefreshToken: string | null;
}

const AuthContext = createContext<IAuthContext>({
  isInitializing: true,
  user: null,
  login,
  signUp: async () => {
    return;
  },
  confirmSignUp,
  isLoggedIn: false,
  logout: async () => {
    return;
  },
  updateGoogleRefreshToken: () => {
    return;
  },
  youtubeRefreshToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({
  children,
}: {
  children: (isInitializing: boolean) => React.ReactNode;
}) => {
  const [user, setUser] = useState<CognitoUserType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (session && session.isValid()) {
          const user = await Auth.currentUserInfo();

          if (Object.values(user).length > 0) {
            setUser(user);
          }
        }
      } catch (error) {
        console.error('Authentication error:' + error?.message ?? 'unknown');
      }

      setIsInitializing(false);
    })();
  }, []);

  const signUp = useCallback(
    async (username: string, password: string, email: string) => {
      await cognitoSignUp(username, password, email);
    },
    []
  );

  const authListener: HubCallback = useCallback(
    ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          setUser(data);
          break;
        case 'signOut':
          setUser(null);
          break;
      }
    },
    []
  );

  useEffect(() => {
    Hub.listen('auth', authListener);
    return () => Hub.remove('auth', authListener);
  }, []);

  const isLoggedIn = useMemo(() => {
    return user !== null;
  }, [user]);

  const logout = useCallback(async () => {
    await Auth.signOut();
  }, []);

  const updateUserAttribute = useCallback(
    async (name: string, value: string | number | null) => {
      try {
        const currentUser = await Auth.currentAuthenticatedUser();
        await Auth.updateUserAttributes(currentUser, {
          [name]: value,
        });

        return true;
      } catch (e) {
        console.error('Update attribute error:', e.message);
        return false;
      }
    },
    []
  );

  const updateGoogleRefreshToken = useCallback(async (refreshToken: string) => {
    await updateUserAttribute('custom:google-refresh-token', refreshToken);
  }, []);

  const youtubeRefreshToken = useMemo(() => {
    return user?.attributes['custom:google-refresh-token'] ?? null;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        isLoggedIn,
        signUp,
        confirmSignUp,
        login,
        logout,
        updateGoogleRefreshToken,
        youtubeRefreshToken,
      }}
    >
      {children(isInitializing)}
    </AuthContext.Provider>
  );
};
