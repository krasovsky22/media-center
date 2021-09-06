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
      <Flex
        width="100%"
        flexWrap="nowrap"
        overflowX="auto"
        className="gap-4"
        flexDirection={{ base: 'column', sm: 'row' }}
      >
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
  @media only screen and (max-width: 600px) {
    :before {
      all: unset;
    }
    width: 100%;
    height: 100px;

    max-width: 100%;
  }
`;

Carousel.Element = ({ children }: WithChildren) => {
  return (
    <StyledBox
      width="calc((100% - 6rem ) / 7)"
      maxWidth="7rem"
      minWidth="5rem"
      flex="0 0 auto"
      height="auto"
    >
      {children}
    </StyledBox>
  );
};

export default Carousel;
