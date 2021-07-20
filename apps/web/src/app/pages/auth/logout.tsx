import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../context/auth';

interface LocationState {
  from: {
    pathname: string;
  };
}

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await logout();
      history.push('/');
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default LogoutPage;
