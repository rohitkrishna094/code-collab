/* eslint-disable max-len */
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router';

const Logo = () => {
  const history = useHistory();

  const items = [
    { value: 'Code', color: '#38A169', fontSize: '2xl' },
    { value: 'Collab', color: '#3182CE', fontSize: '2xl' },
  ];
  return (
    <Flex
      cursor='pointer'
      mr={3}
      onClick={(e: any) => {
        history.push('/');
      }}
    >
      {items.map(item => {
        const { value, color, fontSize } = item;
        return (
          <Text key={Math.random()} as='span' color={color} fontSize={fontSize}>
            {value}
          </Text>
        );
      })}
    </Flex>
  );
};

export default Logo;
