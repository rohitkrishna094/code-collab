/* eslint-disable max-len */
import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router';

const Logo = (props: any) => {
  const history = useHistory();
  let { fontSize } = props;

  const items = [
    { value: 'Code', color: '#38A169', fs: '2xl' },
    { value: 'Collab', color: '#3182CE', fontSize: '2xl' },
  ];
  return (
    <Flex
      cursor='pointer'
      onClick={(e: any) => {
        history.push('/');
      }}
      {...props}
    >
      {items.map(item => {
        const { value, color, fs } = item;
        fontSize = fontSize || fs;
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
