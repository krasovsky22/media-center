import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Loading } from '@youtube-player/components';
import { AuthProvider } from '@youtube-player/auth';
import RouteComponent, { Routes } from './routes';
import {
  Box,
  ChakraProvider,
  useColorModeValue as mode,
} from '@chakra-ui/react';
import { ServicesProvider } from '@youtube-player/services';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <AuthProvider>
          {(isInitializing) => (
            <ServicesProvider>
              <Box
                bgColor={mode('green.50', 'gray.700')}
                className="p-0  min-h-screen min-w-full relative flex flex-col"
              >
                <React.Suspense fallback={<Loading />}>
                  {isInitializing ? (
                    <Loading />
                  ) : (
                    <Router>
                      <Switch>
                        {Routes.map((route, index) => (
                          <RouteComponent key={index} {...route} />
                        ))}
                      </Switch>
                    </Router>
                  )}
                </React.Suspense>
              </Box>
            </ServicesProvider>
          )}
        </AuthProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
