import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router';
import Typist from 'react-typist';
import { v4, validate } from 'uuid';
import Logo from '../Logo/Logo';

const CreateButtonModal = (props: any) => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState('');
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  const onChange = (e: any) => {
    const name = e.target.value;
    setUserName(name);
    setCreateButtonDisabled(!(name && name.length > 0));
  };

  const redirect = () => {
    const id = v4();
    history.push(`${id}?user=${userName}`);
  };

  const onCreateClick = (e: any) => {
    redirect();
  };

  return (
    <Flex {...props}>
      <Button colorScheme='blue' onClick={onOpen}>
        Create a Room
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontSize='md'>
              Enter your Name:
            </Text>
            <Input
              autoFocus={true}
              value={userName}
              onChange={onChange}
              placeholder='Ada Lovelace'
              onKeyDown={e => {
                if (e.key === 'Enter' && !createButtonDisabled) {
                  redirect();
                }
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={onCreateClick}
              disabled={createButtonDisabled}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

const JoinButtonModal = (props: any) => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true);

  const isInputValid = (name: string, id: string) => {
    // return name?.length > 0 && id?.length > 0 && validate(id);
    return name?.length > 0 && id?.length > 0;
  };

  const onChange = (e: any) => {
    const name = e.target.value;
    setUserName(name);
    setJoinButtonDisabled(!isInputValid(name, roomId));
  };

  const onRoomIdChange = (e: any) => {
    const id = e.target.value;
    setRoomId(id);
    setJoinButtonDisabled(!isInputValid(userName, id));
  };

  const redirect = () => {
    history.push(`${roomId}?user=${userName}`);
  };

  const onJoinClick = (e: any) => {
    redirect();
  };

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && !joinButtonDisabled) {
      redirect();
    }
  };

  return (
    <Flex {...props}>
      <Button colorScheme='green' onClick={onOpen}>
        Join a Session
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Join an already running session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4} fontSize='md'>
              Enter your Name:
            </Text>
            <Input
              value={userName}
              onChange={onChange}
              placeholder='Ada Lovelace'
              autoFocus={true}
              onKeyDown={onKeyDown}
            />
            <Text mt={4} mb={4} fontSize='md'>
              Enter Room ID:
            </Text>
            <Input
              value={roomId}
              onChange={onRoomIdChange}
              placeholder='xxxxxxxx-yyyy-zzzz-aaaa-bbbbbbbbbbbb'
              onKeyDown={onKeyDown}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={onJoinClick}
              disabled={joinButtonDisabled}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

const Home = (props: any) => {
  return (
    // <Flex
    //   height='100vh'
    //   width='100vw'
    //   alignItems='center'
    //   justifyContent='center'
    //   bg='#272822'
    //   direction='column'
    // >
    //   <LaunchButtonModal />
    //   <JoinButtonModal />
    // </Flex>
    <Flex
      alignItems='center'
      justifyContent='space-evenly'
      padding={200}
      bg='#202020'
      // bg='red'
      color='white'
    >
      <Flex
        direction='column'
        width='50%'
        alignItems='center'
        justifyContent='center'
        padding={10}
        // bg='blue'
      >
        <Heading
          fontSize={['32px', '48px', '48px']}
          h={['100px', 'auto']}
          textAlign='center'
          mb={5}
        >
          <Typist
            cursor={{ hideWhenDone: true, hideWhenDoneDelay: 1000 }}
            avgTypingDelay={100}
          >
            <span style={{ fontSize: '32px', color: '#38A169' }}>
              Collaboration Made Easy!
            </span>
            <Typist.Delay ms={1000} />
            <Typist.Backspace count={24} />
            <span style={{ color: '#38A169' }}>Code</span>
            <span style={{ color: '#3182CE' }}>Collab</span>
          </Typist>
        </Heading>
        <Flex
          alignItems='center'
          justifyContent='center'
          // backgroundColor='rgba(0,0,0,0.7)'
          // borderRadius='10px'
          width='70%'
          padding={5}
          mb={5}
        >
          <Text textAlign='center'>
            Create a room or join an existing room. Invite your friends and have
            fun pair programming using live code editor and live drawing canvas.
          </Text>
        </Flex>
        <Flex
          direction='row'
          mt={5}
          mb={5}
          alignItems='center'
          justifyContent='space-around'
        >
          <CreateButtonModal mr={10} />
          <JoinButtonModal />
        </Flex>
      </Flex>
      <Flex className='animation'>animation goes here</Flex>
    </Flex>
  );
};

export default Home;
