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
import { ROUTE_LOGOUT, ROUTE_PLAYER } from './routes';

const SuspenseLoader = () => (
  <div className="h-screen flex">
    <Loading />
  </div>
);

const PrivateRoute = ({ children, ...rest }: RouteProps) => {
  const { isInitializing, user } = useAuth();

  if (isInitializing) {
    return <SuspenseLoader />;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user ? (
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
  );
};

const LoginPage = React.lazy(() => import('./pages/auth/login'));
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
