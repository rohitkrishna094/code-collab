import React, { useEffect, useState, useRef } from 'react';
import Excalidraw from '@excalidraw/excalidraw';
import InitialData from './initialData';
import './DrawingPadExcaliDraw.scss';
import { Flex } from '@chakra-ui/react';

const DrawingPadExcaliDraw = () => {
  const excalidrawRef = useRef<any>(null);
  const excalidrawWrapperRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({
    width: undefined,
    height: undefined,
  });

  const [viewModeEnabled, setViewModeEnabled] = useState(false);
  const [zenModeEnabled, setZenModeEnabled] = useState(false);
  const [gridModeEnabled, setGridModeEnabled] = useState(false);

  useEffect(() => {
    if (excalidrawWrapperRef) {
      setDimensions({
        width: excalidrawWrapperRef.current?.getBoundingClientRect().width,
        height: excalidrawWrapperRef.current?.getBoundingClientRect().height,
      });
      const onResize = () => {
        setDimensions({
          width: excalidrawWrapperRef.current?.getBoundingClientRect().width,
          height: excalidrawWrapperRef.current?.getBoundingClientRect().height,
        });
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, [excalidrawWrapperRef]);

  const updateScene = () => {
    const sceneData = {
      elements: [
        {
          type: 'rectangle',
          version: 141,
          versionNonce: 361174001,
          isDeleted: false,
          id: 'oDVXy8D6rom3H1-LLH2-f',
          fillStyle: 'hachure',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 1,
          opacity: 100,
          angle: 0,
          x: 100.50390625,
          y: 93.67578125,
          strokeColor: '#c92a2a',
          backgroundColor: 'transparent',
          width: 186.47265625,
          height: 141.9765625,
          seed: 1968410350,
          groupIds: [],
        },
      ],
      appState: {
        viewBackgroundColor: '#edf2ff',
      },
    };
    excalidrawRef.current.updateScene(sceneData);
  };

  return (
    <Flex className='dpe' height='100%' width='100%'>
      {/* <div className='button-wrapper'>
        <button className='update-scene' onClick={updateScene}>
          Update Scene
        </button>
        <button
          className='reset-scene'
          onClick={() => {
            excalidrawRef.current.resetScene();
          }}
        >
          Reset Scene
        </button>
        <label>
          <input
            type='checkbox'
            checked={viewModeEnabled}
            onChange={() => setViewModeEnabled(!viewModeEnabled)}
          />
          View mode
        </label>
        <label>
          <input
            type='checkbox'
            checked={zenModeEnabled}
            onChange={() => setZenModeEnabled(!zenModeEnabled)}
          />
          Zen mode
        </label>
        <label>
          <input
            type='checkbox'
            checked={gridModeEnabled}
            onChange={() => setGridModeEnabled(!gridModeEnabled)}
          />
          Grid mode
        </label>
      </div> */}
      {/* <Flex
        className='excalidraw-wrapper'
        ref={excalidrawWrapperRef}
        height='100%'
        width='100%'
        bg='blue'
      > */}
      <Excalidraw
        ref={excalidrawRef}
        //   width={dimensions.width}
        //   height={dimensions.height}
        width='100%'
        height='100%'
        initialData={InitialData}
        onChange={(elements: any, state: any) =>
          console.log('Elements :', elements, 'State : ', state)
        }
        onPointerUpdate={(payload: any) => console.log(payload)}
        onCollabButtonClick={() => window.alert('You clicked on collab button')}
        viewModeEnabled={viewModeEnabled}
        zenModeEnabled={zenModeEnabled}
        gridModeEnabled={gridModeEnabled}
      />
      {/* </Flex> */}
    </Flex>
  );
};

export default DrawingPadExcaliDraw;
