import { Flex, Button } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { socket } from '../../socket';
import './DrawingPad.scss';

const DrawingPad = () => {
  const canvasRef = useRef<any>(null);

  useEffect(() => {
    socket.on('draw_change', (data: any) => {
      canvasRef?.current.loadSaveData(data);
    });
    return () => {
      socket.off('draw_change');
    };
  }, []);

  const onClear = (e: any) => {
    canvasRef?.current.clear();
  };

  const onUndo = (e: any) => {
    canvasRef?.current.undo();
  };

  const onChange = () => {
    const data = canvasRef?.current.getSaveData();
    socket.emit('draw_change', data);
  };

  return (
    <Flex height='100%' width='100%' bg='red' direction='column'>
      <Flex bg='#202020' width='100%' padding={2}>
        <Button size='sm' colorScheme='green' onClick={onClear}>
          Clear
        </Button>
        <Button ml={5} size='sm' colorScheme='green' onClick={onUndo}>
          Undo
        </Button>
      </Flex>
      <CanvasDraw
        ref={canvasRef}
        canvasWidth='100%'
        canvasHeight='100%'
        brushRadius={3}
        brushColor='#3182CE'
        catenaryColor={'#FFD500'}
        gridColor={'rgba(0, 180, 216, 0.1)'}
        backgroundColor='#272822'
        immediateLoading={true}
        onChange={onChange}
      />
    </Flex>
  );
};

export default DrawingPad;
