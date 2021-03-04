import {
  Button,
  Flex,
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
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { v4, validate } from 'uuid';

const LaunchButtonModal = () => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState('');
  const [launchButtonDisabled, setLaunchButtonDisabled] = useState(true);

  const onChange = (e: any) => {
    const name = e.target.value;
    setUserName(name);
    setLaunchButtonDisabled(!(name && name.length > 0));
  };

  const redirect = () => {
    const id = v4();
    history.push(`${id}?user=${userName}`);
  };

  const onSessionLaunch = (e: any) => {
    redirect();
  };

  return (
    <>
      <Button colorScheme='blue' onClick={onOpen}>
        Launch Session
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Launch a Collaborative Session</ModalHeader>
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
                if (e.key === 'Enter' && !launchButtonDisabled) {
                  redirect();
                }
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={onSessionLaunch}
              disabled={launchButtonDisabled}
            >
              Launch
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const JoinButtonModal = () => {
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

  const onJoinLaunch = (e: any) => {
    redirect();
  };

  const onKeyDown = (e: any) => {
    if (e.key === 'Enter' && !joinButtonDisabled) {
      redirect();
    }
  };

  return (
    <>
      <Button colorScheme='green' onClick={onOpen} mt={6}>
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
              onClick={onJoinLaunch}
              disabled={joinButtonDisabled}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const Home = (props: any) => {
  return (
    <Flex
      height='100vh'
      width='100vw'
      alignItems='center'
      justifyContent='center'
      bg='#272822'
      direction='column'
    >
      <LaunchButtonModal />
      <JoinButtonModal />
    </Flex>
  );
};

export default Home;