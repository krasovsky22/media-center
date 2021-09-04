import React from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom';
import { useAuth } from '@youtube-player/auth';
import { ServicesProvider } from '@youtube-player/services';
import { Routes as ServiceRoutes } from '@youtube-player/services';

export const SIGN_UP = '/signup';
export const CONFIRM_SIGN_UP = '/confirm-signup';
export const ROUTE_PLAYER = '/player';
export const ROUTE_PLAYER_WITH_ID = '/player/:id';
export const ROUTE_LOGOUT = '/logout';

type RouteType = RouteProps & {
  isSecure?: boolean;
};

export const Routes: RouteType[] = [
  ...ServiceRoutes,
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('./pages/auth/login')),
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
    exact: true,
    path: ROUTE_PLAYER,
    isSecure: true,
    component: React.lazy(async () => import('./pages/player')),
  },
  {
    path: ROUTE_PLAYER_WITH_ID,
    isSecure: true,
    component: React.lazy(async () => import('./pages/player')),
  },
  {
    path: '*',
    component: React.lazy(async () => import('./pages/errors/notfound')),
  },
];

const RouteComponent: React.FC<RouteType> = ({ isSecure = false, ...rest }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (isSecure) {
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
  }

  return <Route {...rest} />;
};

export default RouteComponent;
