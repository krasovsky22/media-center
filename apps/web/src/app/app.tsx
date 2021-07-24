import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Loading } from './components';
import { AuthProvider } from './context/auth';
import RouteComponent, { Routes } from './routes';
import { ChakraProvider } from '@chakra-ui/react';

export function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <div className="container bg-green-50 min-h-screen min-w-full relative flex flex-col">
          <React.Suspense fallback={<Loading />}>
            <Router>
              <Switch>
                {Routes.map((route, index) => (
                  <RouteComponent key={index} {...route} />
                ))}
              </Switch>
            </Router>
          </React.Suspense>
        </div>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
