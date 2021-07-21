import { OAuth2Client, Credentials } from 'google-auth-library';

const STORAGE_KEY = 'google-auth';

const getCachedTokens = (): Credentials | null => {
  const tokenJson = localStorage.getItem(STORAGE_KEY);
  return tokenJson ? JSON.parse(tokenJson) : null;
};

type Subscriber = (tokens: Credentials) => unknown;

const googleAuthService = () => {
  const scopes = ['https://www.googleapis.com/auth/youtube.readonly'];
  const clientId =
    '554041888337-m7qjhesfp68p9ql20qjkv5pm20oduvan.apps.googleusercontent.com';
  const clientSecret = 'VlDI9n4eai1phbpBzkUoSSvc';
  const redirectUri = 'http://localhost:4200/google/callback';
  const oAuth2Client = new OAuth2Client(clientId, clientSecret, redirectUri);

  let subscribers: Subscriber[] = [];

  //try to get tokens from local storage
  const tokens = getCachedTokens();
  if (tokens) {
    oAuth2Client.setCredentials(tokens);
    console.log('from localstorage', tokens);
  }

  oAuth2Client.on('tokens', (tokens) => {
    console.log('event', tokens);
    oAuth2Client.setCredentials(tokens);

    //update localstorage with new tokens
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));

    //notify subscribers
    subscribers.forEach((subscriber) => subscriber(tokens));
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

    getAccessToken: async () => await oAuth2Client.getAccessToken(),

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
