import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import styled from 'styled-components';
import { Design } from '..';

type WithChildren = {
  children: React.ReactNode;
};

type CarouselType = {
  title: string;
};
const Carousel = ({ title, children }: WithChildren & CarouselType) => {
  return (
    <Flex direction="column" className="gap-1">
      <Design.H2>{title}</Design.H2>
      <Flex width="100%" flexWrap="nowrap" overflowX="auto" className="gap-4">
        {children}
      </Flex>
    </Flex>
  );
};

const StyledBox = styled(Box)`
  :before {
    content: '';
    float: left;
    padding-top: 100%;
  }
`;

Carousel.Element = ({ children }: WithChildren) => {
  return (
    <StyledBox width="calc((100% - 6rem ) / 7)" flex="0 0 auto" height="auto">
      {children}
    </StyledBox>
  );
};

export default Carousel;
