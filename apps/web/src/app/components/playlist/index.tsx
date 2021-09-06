import { Avatar, Badge, Box, Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Design } from '..';
import { default as Icons } from '../icons';

type WithChildren = {
  children: React.ReactNode;
};

const Playlist = ({ children }: WithChildren) => {
  return (
    <Flex direction="column" flexGrow={1} className="gap-4">
      {children}
    </Flex>
  );
};

Playlist.Header = ({ children }: WithChildren) => {
  return (
    <Flex
      flexDirection="row"
      flexWrap="nowrap"
      className="gap-4"
      alignItems="center"
      flexGrow={1}
    >
      {children}
    </Flex>
  );
};

type ProfileSectionType = {
  url: string;
  name: string;
};
Playlist.ProfileSection = ({ url, name }: ProfileSectionType) => {
  return (
    <Flex>
      <Avatar
        src={url}
        name={name}
        flexGrow={1}
        size="2xl"
        boxShadow="0px 1rem 1rem 0.5rem rgb(0 0 0 / 11%)"
      />
    </Flex>
  );
};

type DescriptionSectionType = {
  source: 'youtube';
  title: string;
  description: string;
};
Playlist.DescriptionSection = ({
  source,
  title,
  description,
}: DescriptionSectionType) => {
  return (
    <Flex flexGrow={4} flexDirection="column" className="gap-1">
      <Box>
        <Badge colorScheme="green">{source}</Badge>
      </Box>
      <Box>
        <h1 className="text-lg font-bold">{title}</h1>
      </Box>
      <Box>
        <h2 className="text-sm font-light ">{description}</h2>
      </Box>
    </Flex>
  );
};

type HeaderButtonsType = {
  count: number;
  onClick: () => void;
};

Playlist.HeaderButtons = ({ count, onClick }: HeaderButtonsType) => {
  return (
    <Flex flexDir="column" className="gap-2">
      <Box textAlign="center">
        <Text fontSize="smaller">
          <em>{count} tracks</em>
        </Text>
      </Box>
      <Box>
        <Button
          colorScheme="red"
          borderRadius="5px"
          leftIcon={<Icons.Play />}
          variant="solid"
          size="sm"
          onClick={onClick}
        >
          Play
        </Button>
      </Box>
    </Flex>
  );
};

Playlist.Body = ({ children }: WithChildren) => {
  return (
    <Flex direction="column" flexGrow={3}>
      <div>
        <Design.H2>Playlist Tracks</Design.H2>
      </div>
      {children}
    </Flex>
  );
};

type BoxItemType = {
  thumb_url: string;
  title: string;
};
Playlist.BoxItem = ({ thumb_url, title, ...rest }: BoxItemType) => {
  return (
    <Flex
      direction={{ base: 'row', sm: 'column' }}
      height="100%"
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        backgroundImage={`url(${thumb_url})`}
        backgroundPosition="center"
        backgroundSize="cover"
        width="100%"
        height="100%"
        maxWidth={{ base: '30%', sm: '100%' }}
        flexGrow={1}
        {...rest}
      />
      <Text fontWeight="semibold" textAlign="center" flexGrow={1}>
        {title}
      </Text>
    </Flex>
  );
};

export default Playlist;
