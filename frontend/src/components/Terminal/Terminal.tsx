import React from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { STDOUT_TYPES } from '../../actionTypes';
import { languageDataWithKeys } from '../CodeEditor/editorData';
import './Terminal.scss';

const Terminal = ({ items }: any) => {
  return (
    <Flex
      className='terminal'
      color='white'
      minWidth='30%'
      maxWidth='30%'
      width='30%'
      bg='#272822'
      direction='column'
      height='100%'
      padding={5}
      overflowY='auto'
    >
      {items.map((item: any) => {
        const { type, payload } = item;
        if (type === STDOUT_TYPES.A_MESSAGE) {
          const { data } = payload;
          return <Text key={Math.random()}>{data}</Text>;
        } else if (type === STDOUT_TYPES.A_CODE_RUN) {
          const { userName: userWhoRan, langId: newLangId } = payload;
          const langName = languageDataWithKeys[newLangId]?.name;
          return (
            <Text key={Math.random()}>
              User{' '}
              <Text as='span' color='#3182CE'>
                {userWhoRan}
              </Text>{' '}
              ran
              <Text as='span' color='#38A169'>
                {' '}
                {langName}
              </Text>{' '}
              code just now.
            </Text>
          );
        } else if (type === STDOUT_TYPES.A_CODE_RUN_RESULT) {
          const { result } = payload;
          return (
            <Text key={Math.random()} whiteSpace='pre'>
              {result}
            </Text>
          );
        } else if (type === STDOUT_TYPES.A_LANGUAGE_CHANGE) {
          const { userName: userWhoChanged, language } = payload;
          return (
            <Text key={Math.random()}>
              User{' '}
              <Text as='span' color='#3182CE'>
                {userWhoChanged}
              </Text>{' '}
              changed language to
              <Text as='span' color='#38A169'>
                {' '}
                {language}
              </Text>
            </Text>
          );
        }
        return null;
      })}
    </Flex>
  );
};

export default Terminal;
