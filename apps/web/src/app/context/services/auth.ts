import { Auth } from 'aws-amplify';

export async function signIn(username: string, password: string) {
  try {
    const user = await Auth.signIn(username, password);
    console.log(user);
  } catch (error) {
    console.log('error signing in', error);
  }
}

export async function signOut() {
  try {
    await Auth.signOut({ global: true });
  } catch (error) {
    console.log('error signing out: ', error);
  }
}

export async function currentUser() {
  const user = await Auth.currentAuthenticatedUser({
    bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
  }).catch((err) => {
    console.log(err);
    return null;
  });

  return user;
}
