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
const DashboardPage = React.lazy(async () => import('./pages/dashboard'));
export function App() {
  return (
    <AuthProvider>
      <div className="container bg-green-50 min-h-screen min-w-full">
        <React.Suspense fallback={<SuspenseLoader />}>
          <Router>
            <Switch>
              <Route exact path="/">
                <LoginPage />
              </Route>
              <PrivateRoute path="/logout">
                <LogoutPage />
              </PrivateRoute>
              <PrivateRoute path="/dashboard">
                <DashboardPage />
              </PrivateRoute>
            </Switch>
          </Router>
        </React.Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
