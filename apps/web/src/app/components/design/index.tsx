import { Text } from '@chakra-ui/react';
import React from 'react';

type WithChildrenType = {
  children: React.ReactNode;
};
const H2: React.FC<WithChildrenType> = ({ children }) => {
  return (
    <h2>
      <Text fontSize="medium" fontWeight="semibold">
        {children}
      </Text>
    </h2>
  );
};

export default {
  H2,
};
