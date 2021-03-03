import { Flex } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import './DrawingPad.scss';

interface DrawingPadProps {
  socket: SocketIOClient.Socket;
}

const DrawingPad = ({ socket }: DrawingPadProps) => {
  socket.on('codechange', (newValue: string) => {
    // setCodeValue(newValue);
  });

  return (
    <Flex height='100%' width='100%'>
      <CanvasDraw
        canvasWidth='100%'
        canvasHeight='100%'
        brushRadius={3}
        brushColor='#3182CE'
        catenaryColor={'#FFD500'}
        gridColor={'rgba(0, 180, 216, 0.1)'}
        backgroundColor='#272822'
      />
    </Flex>
  );
};

export default DrawingPad;
