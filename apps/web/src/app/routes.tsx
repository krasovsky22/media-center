import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { Loading } from './components';
import { useAuth } from './context/auth';
import { ServicesProvider } from './context/services';

export const SIGN_UP = '/signup';
export const CONFIRM_SIGN_UP = '/confirm-signup';
export const ROUTE_PLAYER = '/player';
export const ROUTE_LOGOUT = '/logout';
export const ROUTE_GOOGLE_CALLBACK = '/google/callback';

type RouteType = RouteProps & {
  isSecure?: boolean;
};

export const Routes: RouteType[] = [
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('./pages/auth/login')),
  },
  {
    path: ROUTE_GOOGLE_CALLBACK,
    exact: true,
    component: React.lazy(() => import('./pages/auth/google-callback')),
  },
  {
    path: SIGN_UP,
    component: React.lazy(() => import('./pages/auth/signup')),
  },
  {
    path: CONFIRM_SIGN_UP,
    exact: true,
    component: React.lazy(() => import('./pages/auth/confirm-signup')),
  },
  {
    path: ROUTE_LOGOUT,
    component: React.lazy(() => import('./pages/auth/logout')),
  },
  {
    path: ROUTE_PLAYER,
    exact: true,
    isSecure: true,
    component: React.lazy(async () => import('./pages/player')),
  },
  {
    path: '*',
    component: React.lazy(async () => import('./pages/errors/notfound')),
  },
];

const SuspenseLoader = () => (
  <div className="h-screen flex">
    <Loading />
  </div>
);

const PrivateRoute = ({ children }: { children: React.ReactChild }) => {
  const { isInitializing, isLoggedIn } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <SuspenseLoader />;
  }

  if (!isLoggedIn) {
    return (
      <Redirect
        to={{
          pathname: '/',
          state: { from: location },
        }}
      />
    );
  }

  return <ServicesProvider>{children}</ServicesProvider>;
};

const RouteComponent: React.FC<RouteType> = ({ isSecure = false, ...rest }) => {
  if (isSecure) {
    return (
      <PrivateRoute>
        <Route {...rest} />
      </PrivateRoute>
    );
  }

  return <Route {...rest} />;
};

export default RouteComponent;
