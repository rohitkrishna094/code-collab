import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Flex, Text } from '@chakra-ui/react';
import { STDOUT_TYPES } from '../../actionTypes';
import { languageDataWithKeys } from '../CodeEditor/editorData';

const Terminal = ({ items }: any) => {
  return (
    <Flex
      color='white'
      minWidth='30%'
      width='30%'
      flex='1'
      bg='#272822'
      direction='column'
      height='100%'
      padding={5}
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
