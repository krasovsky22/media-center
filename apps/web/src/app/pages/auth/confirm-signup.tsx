import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Loading } from '@youtube-player/components';
import { useAuth } from '@youtube-player/auth';
import { useQuery } from '@youtube-player/hooks';
import { ROUTE_PLAYER } from '../../routes';

const ConfirmSignUp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const { confirmSignUp } = useAuth();
  const codeInputField = useRef<HTMLInputElement>(null);
  const history = useHistory();

  const username = useQuery('username') as string;

  useEffect(() => {
    codeInputField.current?.focus();
  }, []);

  const onVerificationCodeSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsLoading(true);
      try {
        await confirmSignUp(username, verificationCode);
        history.push('/');
      } catch (e) {
        setError(e.message);

        setIsLoading(false);
      }
    },
    [verificationCode, username]
  );

  if (!username) {
    return <Redirect to="/404" />;
  }

  return (
    <>
      {isLoading && <Loading />}
      <Container margin="auto">
        <form onSubmit={onVerificationCodeSubmit}>
          <Box backgroundColor="white" padding="5">
            <VStack alignItems="normal">
              <div>Verification code was successfully sent</div>
              <HStack>
                <Input
                  type="text"
                  ref={codeInputField}
                  onChange={(event) => setVerificationCode(event.target.value)}
                />
                <Button>Submit</Button>
              </HStack>
              {error && (
                <Alert status="error">
                  <AlertIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </VStack>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default ConfirmSignUp;
