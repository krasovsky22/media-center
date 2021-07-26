import React from 'react';
import { RouteProps } from 'react-router-dom';
import GoogleCallbackPage from './pages/google-callback';

export const ROUTE_GOOGLE_CALLBACK = '/google/callback';

type RouteType = RouteProps & {
  isSecure?: boolean;
};

export const Routes: RouteType[] = [
  {
    path: ROUTE_GOOGLE_CALLBACK,
    exact: true,
    isSecure: true,
    component: GoogleCallbackPage,
  },
];
