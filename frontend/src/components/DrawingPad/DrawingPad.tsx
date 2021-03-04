import { Flex, Button } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import './DrawingPad.scss';

const DrawingPad = () => {
  const canvasRef = useRef<any>(null);

  const onClear = (e: any) => {
    canvasRef?.current.clear();
  };

  const onUndo = (e: any) => {
    canvasRef?.current.undo();
  };

  const onChange = () => {
    const data = canvasRef?.current.getSaveData();
  };

  const onSave = () => {
    const data = canvasRef?.current.getSaveData();
    if (data) localStorage.setItem('drawing', data);
  };

  const onLoad = () => {
    const data = localStorage.getItem('drawing');
    if (data) canvasRef?.current.loadSaveData(data);
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
        <Button ml={5} size='sm' colorScheme='green' onClick={onSave}>
          Save
        </Button>
        <Button ml={5} size='sm' colorScheme='green' onClick={onLoad}>
          Load
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
        onChange={onChange}
      />
    </Flex>
  );
};

export default DrawingPad;
