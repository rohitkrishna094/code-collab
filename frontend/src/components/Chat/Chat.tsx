import { Flex, Text } from '@chakra-ui/layout';
import React, { useEffect, useReducer, useState } from 'react';
import { TiArrowSortedDown } from 'react-icons/ti';
import { IoMdChatbubbles, IoMdSend } from 'react-icons/io';
import { Avatar } from '@chakra-ui/avatar';
import { InputGroup, InputRightElement } from '@chakra-ui/input';
import ResizeTextarea from 'react-textarea-autosize';
import { Textarea } from '@chakra-ui/textarea';
import ChatReducer from '../../store/reducers/ChatReducer';
import { CHAT_TYPES } from '../../actionTypes';
import { isBlank, isNotBlank } from '../../utils/stringUtils';
import {
  CHAT_MESSAGE_SENT,
  SChatMessageSentEventInput,
  socket,
} from '../../socket';
import { useSelector } from 'react-redux';
import './Chat.scss';

const dummyImg =
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=633&q=80';

const ChatItem = (props: any) => {
  const { content, userName, isMyMessage } = props;

  return (
    <Flex className='chat-item-wrapper' width='100%' mb={2}>
      <Flex className='avatar' display={isMyMessage ? 'none' : 'flex'}>
        <Avatar size='sm' name={userName} />
      </Flex>
      <Flex
        className='content'
        ml={4}
        flex='1'
        bg={isMyMessage ? '#202020' : '#3C3C3C'}
        padding={1}
        borderRadius='4px'
        direction='column'
        paddingLeft={5}
        paddingRight={5}
      >
        <Text fontSize='sm' color='#BDC3C7'>
          {isMyMessage ? 'You' : userName}
        </Text>
        <Text wordBreak='break-all'>{content}</Text>
      </Flex>
    </Flex>
  );
};

const AutoResizeTextarea = React.forwardRef((props: any, ref: any) => {
  return (
    <Textarea
      minH='unset'
      overflow='hidden'
      w='100%'
      resize='none'
      ref={ref}
      minRows={1}
      as={ResizeTextarea}
      maxHeight='100px'
      {...props}
    />
  );
});

AutoResizeTextarea.displayName = 'AutoResizeTextarea';

const Chat = (props: any) => {
  const { shouldDisplay } = props;
  const [value, setValue] = useState('');
  const [chatContent, dispatchChatContent] = useReducer(ChatReducer, []);
  const userState = useSelector((state: any) => state.user);
  const { userName } = userState;

  useEffect(() => {
    socket.on(CHAT_MESSAGE_SENT, (data: SChatMessageSentEventInput) => {
      dispatchChatContent(data);
    });

    return () => {
      socket.off(CHAT_MESSAGE_SENT);
    };
  }, []);

  const handleInputChange = (e: any) => {
    setValue(e.target.value);
  };

  const onKeyDown = (e: any) => {
    if (isBlank(userName)) return;

    if (e.key === 'Enter' && isNotBlank(value)) {
      const chatMessageSentAction: any = {
        type: CHAT_TYPES.A_SENT_MESSAGE,
        payload: { userName, msg: value },
      };
      socket.emit(CHAT_MESSAGE_SENT, chatMessageSentAction);
      chatMessageSentAction.payload.isMyMessage = true;
      dispatchChatContent(chatMessageSentAction);
      setValue('');
    }
  };

  return (
    <Flex
      className='chat-wrapper'
      color='white'
      direction='column'
      bg='#272822'
      // bg='red'
      borderLeft='2px solid #202020'
      borderTop='2px solid #202020'
      minWidth='25%'
      maxWidth='25%'
      width='25%'
      height='100%'
      // overflowY='auto'
      display={shouldDisplay ? 'flex' : 'none'}
      position='absolute'
      right='0'
      zIndex='1'
      boxSizing='border-box'
      alignItems='center'
    >
      <Flex
        justifyContent='center'
        alignItems='center'
        padding={3}
        fontSize='24px'
      >
        <IoMdChatbubbles />
      </Flex>
      <Flex
        className='chat-content'
        padding={3}
        direction='column-reverse'
        overflowY='auto'
        borderBottom='4px solid #272822'
        height='100%'
        width='100%'
        mb={3}
      >
        {/* reverse chatContent and then use map */}
        {chatContent
          .slice(0)
          .reverse()
          .map((item: any) => {
            const { type, payload } = item;
            const { userName, msg, isMyMessage } = payload;

            return (
              <ChatItem
                key={Math.random()}
                content={msg}
                userName={userName}
                isMyMessage={isMyMessage}
              />
            );
          })}
      </Flex>
      <InputGroup
        className='chat-type-group'
        ml={3}
        mr={3}
        mb={3}
        width='90%'
        boxSizing='border-box'
        onKeyDown={onKeyDown}
      >
        <AutoResizeTextarea
          placeholder='Message this channel'
          value={value}
          onChange={handleInputChange}
        />

        <InputRightElement className='add-icon-wrapper'>
          <IoMdSend />
        </InputRightElement>
      </InputGroup>
    </Flex>
  );
};

export const ChatToggle = (props: any) => {
  const { isChatOpen, onChatToggle, style } = props;
  return (
    <Flex
      className='chat-toggle'
      color='white'
      position='absolute'
      top='50%'
      right={isChatOpen ? '25%' : '0'}
      zIndex='1'
      cursor='pointer'
      backgroundColor='#202020'
      height='80px'
      alignItems='center'
      justifyContent='center'
      border='1px solid black'
      borderBottomLeftRadius='8px'
      borderTopLeftRadius='8px'
      onClick={onChatToggle}
      style={style}
    >
      <TiArrowSortedDown
        style={{
          transform: isChatOpen ? 'rotate(-90deg)' : 'rotate(90deg)',
        }}
      />
    </Flex>
  );
};

export default Chat;
