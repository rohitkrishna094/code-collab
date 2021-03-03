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
import { v4 } from 'uuid';

const Home = () => {
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [launchButtonDisabled, setLaunchButtonDisabled] = useState(true);

  const onChange = (e: any) => {
    const name = e.target.value;
    setUserName(name);
    if (name && name.length > 0) setLaunchButtonDisabled(false);
    else setLaunchButtonDisabled(true);
  };

  const onRoomIdChange = (e: any) => {
    setRoomId(e.target.value);
  };

  const onSessionLaunch = (e: any) => {
    const id = v4();
    history.push(`${id}?user=${userName}`);
  };

  return (
    <Flex
      height='100vh'
      width='100vw'
      alignItems='center'
      justifyContent='center'
      bg='#272822'
      //   bg='#202020'
      direction='column'
    >
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
              value={userName}
              onChange={onChange}
              placeholder='Ada Lovelace'
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
            />
            <Text mt={4} mb={4} fontSize='md'>
              Enter Room ID:
            </Text>
            <Input
              value={roomId}
              onChange={onRoomIdChange}
              placeholder='xxxxxxxx-yyyy-zzzz-aaaa-bbbbbbbbbbbb'
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={onSessionLaunch}
              disabled={launchButtonDisabled}
            >
              Join
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Home;
