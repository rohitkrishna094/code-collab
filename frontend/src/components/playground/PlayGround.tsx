import React, { useEffect } from 'react';
import {
  Box,
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
import { baseUrl } from '../../api/apiInfo';
import useQuery from '../../hooks/useQuery';

interface Params {
  roomId: string;
}

const PlayGround = () => {
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

  return (
    <Flex className='playground' height='100vh' width='100vw'>
      <Tabs
        variant='enclosed-colored'
        bgColor='#272822'
        borderBottomColor='#202020'
        width='100%'
        display='flex'
        flexDirection='column'
        defaultIndex={1}
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
  );
};

export default PlayGround;
