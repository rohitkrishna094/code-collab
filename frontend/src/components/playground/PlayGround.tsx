import React, { useEffect } from 'react';
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
import { socket } from '../../socket/index';
import { RiCodeSSlashLine, RiPencilFill } from 'react-icons/ri';
import './PlayGround.scss';
import { useParams } from 'react-router';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { baseUrl } from '../../api/apiInfo';
import useQuery from '../../hooks/useQuery';
import Logo from '../Logo/Logo';

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

  useEffect(() => {
    socket.on('userjoined', (userName: string) => {
      console.log(userName, 'joined');
      toast({
        title: `${userName} joined`,
        status: 'success',
        isClosable: true,
      });
    });

    socket.on('userleft', (userName: string) => {
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
    socket.emit('joinroom', data);

    return () => {
      socket.off('userjoined');
      socket.off('userleft');
      socket.off('joinroom');
    };
  }, []);

  const Navbar = () => {
    return (
      <Flex
        className='navbar'
        color='white'
        backgroundColor='#202020'
        alignItems='center'
        padding={2}
      >
        <Logo />
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
            <TabPanel padding={0} height='100%'>
              <CodeEditor userName={name} />
            </TabPanel>
            <TabPanel padding={0} height='100%'>
              <DrawingPad />
              {/* <DrawingPadExcaliDraw /> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
};

export default PlayGround;
