import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { useCanvas } from './CanvasContext';

const DrawingPadNative = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef() as MutableRefObject<HTMLCanvasElement>;
  const contextRef = useRef() as MutableRefObject<CanvasRenderingContext2D>;
  const backgroundColor = '#272822';
  const strokeColor = '#3182CE';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth * 2;
    canvas.height = window.innerHeight * 2;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const context = canvas.getContext('2d');
    if (!context) return;
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = strokeColor;
    context.lineWidth = 5;
    contextRef.current = context;
  }, []);

  const startDrawing = ({ nativeEvent }: any) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }: any) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.fillStyle = backgroundColor;
    contextRef.current.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Flex height='100%' width='100%' direction='column'>
      <Flex bg='#202020' width='100%' padding={2}>
        <Button size='sm' colorScheme='green' onClick={clearCanvas}>
          Clear
        </Button>
        <Button ml={5} size='sm' colorScheme='green'>
          Undo
        </Button>
        <Button ml={5} size='sm' colorScheme='green'>
          Save
        </Button>
        <Button ml={5} size='sm' colorScheme='green'>
          Load
        </Button>
      </Flex>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
      />
    </Flex>
  );
};

export default DrawingPadNative;
