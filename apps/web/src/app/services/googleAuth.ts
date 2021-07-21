import { OAuth2Client, Credentials } from 'google-auth-library';

const STORAGE_KEY = 'google-auth';

const getCachedTokens = (): Credentials | null => {
  const tokenJson = localStorage.getItem(STORAGE_KEY);
  return tokenJson ? JSON.parse(tokenJson) : null;
};

type Subscriber = (tokens: Credentials) => unknown;

const googleAuthService = (redirectUri: string) => {
  const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
  const clientId = process.env?.NX_REACT_APP_GOOGLE_CLIENT_ID ?? '';
  const clientSecret = process.env?.NX_REACT_APP_GOOGLE_CLIENT_SECRET ?? '';
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  let subscribers: Subscriber[] = [];

  //try to get tokens from local storage
  const tokens = getCachedTokens();
  if (tokens) {
    oAuth2Client.setCredentials(tokens);
    console.log('from localstorage', tokens);
  }

  oAuth2Client.on('tokens', (refreshedTokens) => {
    const newTokens = { ...tokens, ...refreshedTokens };
    oAuth2Client.setCredentials(newTokens);

    //update localstorage with new tokens
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTokens));

    //notify subscribers
    subscribers.forEach((subscriber) => subscriber(newTokens));
  });

  return {
    subscribe: (listener: Subscriber) => {
      subscribers.push(listener);
    },

    unsubscribeAll: () => {
      subscribers = [];
    },

    processCallbackCode: async (code: string) =>
      await oAuth2Client.getToken(code),

    generateAuthUrl: () =>
      oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
      }),

    refreshToken: async () => await oAuth2Client.refreshAccessToken(),

    get token() {
      return getCachedTokens();
    },

    destroySession: async () => {
      //remove local storage
      localStorage.removeItem(STORAGE_KEY);

      await oAuth2Client.revokeCredentials();
    },
  };
};

export default googleAuthService;
