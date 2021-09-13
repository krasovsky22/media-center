import { OAuth2Client } from 'google-auth-library';
import { Headers } from 'google-auth-library/build/src/auth/oauth2client';
import { useEnvVariables } from '@youtube-player/hooks';
import { ROUTE_GOOGLE_CALLBACK } from '../routes';

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const googleAuthService = (refreshToken: string | null) => {
  const { app_host, google_client_id, google_client_secret } =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEnvVariables();
  const redirectUri = app_host + ROUTE_GOOGLE_CALLBACK;

  const oAuth2Client = new OAuth2Client(
    google_client_id,
    google_client_secret,
    redirectUri
  );

  if (refreshToken) {
    oAuth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  return {
    processCallbackCode: async (code: string) =>
      await oAuth2Client.getToken(code),

    generateAuthUrl: () =>
      oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
      }),

    getRequestHeaders: async (): Promise<Headers> => {
      return await oAuth2Client.getRequestHeaders();
    },

    get refreshToken() {
      return oAuth2Client.credentials.refresh_token ?? null;
    },

    destroySession: async (access_token: string) => {
      try {
        await oAuth2Client.revokeToken(access_token);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error('Destroy google session error', e.message);
      }
    },
  };
};

export default googleAuthService;
