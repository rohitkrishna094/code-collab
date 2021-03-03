import { Flex } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { SketchField, Tools } from 'react-sketch';
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
      <SketchField
        width='100%'
        height='100%'
        widthCorrection={0}
        tool={Tools.Pencil}
        lineColor='#3182CE'
        lineWidth={3}
      />
    </Flex>
  );
};

export default DrawingPad;
