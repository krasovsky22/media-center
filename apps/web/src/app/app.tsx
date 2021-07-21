import React from 'react';
import { AuthProvider, useAuth } from './context/auth';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  RouteProps,
} from 'react-router-dom';
import { Loading } from './components';
import { ROUTE_LOGOUT, ROUTE_PLAYER, ROUTE_GOOGLE_CALLBACK } from './routes';

import { ServicesProvider } from './context/services';

const SuspenseLoader = () => (
  <div className="h-screen flex">
    <Loading />
  </div>
);

const PrivateRoute = ({ children, ...rest }: RouteProps) => {
  const { isInitializing, isLoggedIn } = useAuth();

  if (isInitializing) {
    return <SuspenseLoader />;
  }

  return (
    <ServicesProvider>
      <Route
        {...rest}
        render={({ location }) =>
          isLoggedIn ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: '/',
                state: { from: location },
              }}
            />
          )
        }
      />
    </ServicesProvider>
  );
};

const LoginPage = React.lazy(() => import('./pages/auth/login'));
const GoogleCallbackPage = React.lazy(
  () => import('./pages/auth/googleCallback')
);
const LogoutPage = React.lazy(() => import('./pages/auth/logout'));
const PlayerPage = React.lazy(async () => import('./pages/player'));
const NotFoundPage = React.lazy(async () => import('./pages/errors/notfound'));

export function App() {
  return (
    <AuthProvider>
      <div className="container bg-green-50 min-h-screen min-w-full relative">
        <React.Suspense fallback={<SuspenseLoader />}>
          <Router>
            <Switch>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <Route exact path={ROUTE_GOOGLE_CALLBACK}>
                <GoogleCallbackPage />
              </Route>
              <PrivateRoute path={ROUTE_LOGOUT}>
                <LogoutPage />
              </PrivateRoute>
              <PrivateRoute path={ROUTE_PLAYER}>
                <PlayerPage />
              </PrivateRoute>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </Router>
        </React.Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
