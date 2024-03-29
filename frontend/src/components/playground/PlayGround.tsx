import React, { useEffect, useReducer } from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import CodeEditor from '../CodeEditor/CodeEditor';
import DrawingPad from '../DrawingPad/DrawingPad';
import DrawingPadExcaliDraw from '../DrawingPadExcaliDraw/DrawingPadExcaliDraw';
import { socket, USER_JOIN, USER_LEFT } from '../../socket/index';
import { RiCodeSSlashLine, RiPencilFill } from 'react-icons/ri';
import './PlayGround.scss';
import { useParams } from 'react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useQuery from '../../hooks/useQuery';
import Logo from '../Logo/Logo';
import DrawingPadNative from '../DrawingPad/DrawingPadNative';
import { USER_TYPES } from '../../actionTypes';
import { isNotBlank } from '../../utils/stringUtils';
import { useDispatch } from 'react-redux';

interface Params {
  roomId: string;
}

const PlayGround = (props: any) => {
  const tabOptions = [
    { value: 'Code', icon: <RiCodeSSlashLine /> },
    { value: 'Draw', icon: <RiPencilFill /> },
  ];
  const { roomId }: Params = useParams();
  const query: any = useQuery();
  const name = query.get('user');
  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(USER_JOIN, (userName: string) => {
      console.log(userName, 'joined');
      toast({
        title: `${userName} joined`,
        status: 'success',
        isClosable: true,
      });
    });

    socket.on(USER_LEFT, (userName: string) => {
      console.log(userName, 'left');
      toast({
        title: `${userName} left`,
        status: 'error',
        isClosable: true,
      });
    });

    const data = {
      room: roomId,
      name,
    };
    socket.emit(USER_JOIN, data);

    return () => {
      socket.off(USER_JOIN);
      socket.off(USER_LEFT);
    };
  }, []);

  useEffect(() => {
    if (isNotBlank(name)) {
      dispatch({
        type: USER_TYPES.A_USERNAME_CHANGE,
        payload: { name },
      });
    }
  }, [name]);

  const Navbar = () => {
    return (
      <Flex
        className='navbar'
        color='white'
        backgroundColor='#202020'
        alignItems='center'
        padding={2}
      >
        <Logo mr={3} />
        <CopyToClipboard
          // text={`${window.location.origin}/#/${roomId}`}
          text={roomId}
          onCopy={(link, _) => {
            console.log('copied', link);
            toast({
              // title: `Copied link, you can share it with your friend now. ${link}`,
              title: `Copied roomId: ${roomId}`,
              status: 'success',
              isClosable: true,
              position: 'top',
            });
          }}
        >
          <Button colorScheme='green' size='sm'>
            Copy RoomId
          </Button>
        </CopyToClipboard>
      </Flex>
    );
  };

  return (
    <Flex
      className='playground'
      direction='column'
      height='100vh'
      width='100vw'
      maxHeight='100vh'
      maxWidth='100vw'
      overflow='hidden'
    >
      <Navbar />
      <Flex className='playground-inner' flex='1'>
        <Tabs
          variant='enclosed-colored'
          bgColor='#272822'
          borderBottomColor='#202020'
          width='100%'
          display='flex'
          flexDirection='column'
          defaultIndex={0}
          isLazy
        >
          <TabList>
            {tabOptions.map(item => (
              <Tab
                key={Math.random()}
                className='tab_mine'
                bg='#272822'
                color='grey'
                borderTop='none'
                borderLeft='none'
                borderRight='none'
                borderBottom='none'
                _selected={{
                  color: 'white',
                  bg: '#202020',
                  border: 'none',
                  borderTop: '3px solid green',
                  borderTopColor: 'blue.500',
                }}
              >
                <HStack>
                  <Box>{item.icon}</Box>
                  <Box>{item.value}</Box>
                </HStack>
              </Tab>
            ))}
          </TabList>
          <TabPanels flex='1 1 auto'>
            <TabPanel
              padding={0}
              height='100%'
              maxHeight='calc(100vh - 94px)' // temp fix for the overflow on Terminal component
              className='tab_panel_code_editor_wrapper'
              position='relative'
            >
              <CodeEditor userName={name} />
            </TabPanel>
            <TabPanel padding={0} height='100%'>
              {/* <DrawingPad /> */}
              <DrawingPadNative />
              {/* <DrawingPadExcaliDraw /> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export default PlayGround;
