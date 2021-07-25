export default function useEnvVariables() {
  const {
    NX_REACT_APP_APP_HOST: app_host = '',
    NX_REACT_APP_YOUTUBE_API_KEY: youtube_api_key = '',
    NX_REACT_APP_GOOGLE_CLIENT_SECRET: google_client_secret = '',
    NX_REACT_APP_GOOGLE_CLIENT_ID: google_client_id = '',
  } = process.env;
  return { app_host, google_client_secret, google_client_id, youtube_api_key };
}
