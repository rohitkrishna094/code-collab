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
        canvasWidth={'auto'}
        canvasHeight={'548px'}
        brushRadius={3}
        brushColor='blue'
        catenaryColor={'#FFD500'}
        gridColor={'rgba(0, 180, 216, 0.1)'}
      />
    </Flex>
  );
};

export default DrawingPad;
