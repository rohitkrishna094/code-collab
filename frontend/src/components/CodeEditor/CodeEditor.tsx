import React, { useEffect, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import {
  Box,
  Button,
  Flex,
  HStack,
  Select,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { cloneDeep } from 'lodash';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
// import 'ace-builds/src-min-noconflict/ext-language_tools';
// import 'ace-builds/webpack-resolver';
import { themes, languageDataWithKeys } from './editorData';
import { judgeUrl } from '../../api/apiInfo';
import { delay } from '../../utils';
import { Resizable } from 're-resizable';
import { Ace } from 'ace-builds';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-erlang';
import 'ace-builds/src-noconflict/mode-golang';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-kotlin';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-ruby';
import 'ace-builds/src-noconflict/mode-typescript';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-tomorrow_night';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-kuroir';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/src-noconflict/theme-xcode';
import 'ace-builds/src-noconflict/theme-textmate';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-terminal';

// Object.keys(languageDataWithKeys).forEach(key => {
//   const languageData = languageDataWithKeys[key];
//   const { mode } = languageData;
//   require(`ace-builds/src-noconflict/mode-${mode}`);
//   require(`ace-builds/src-noconflict/snippets/${mode}`);
// });
// themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

interface CodeEditorProps {
  socket: SocketIOClient.Socket;
  userName: string;
}

// socket io event types, S stands for socket io
interface SLanguageChangeEventInput {
  id: number;
  mode: string;
  codeValue: string;
  userName: string;
}

const getDefaultMode = (id: string) => {
  const data = languageDataWithKeys[id];
  if (data && data.defaultValue) return data.defaultValue;
};

const getDefaultLangId = () => 62;

const CodeEditor = ({ socket, userName }: CodeEditorProps) => {
  const [mode, setMode] = useState('java');
  const [langId, setLangId] = useState(getDefaultLangId());
  const [codeValue, setCodeValue] = useState(getDefaultMode(langId + ''));
  const [theme, setTheme] = useState('monokai');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isError, setIsError] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [stdoutOutput, setStdoutOutput] = useState<any>([
    {
      type: 'message',
      payload: {
        data: 'Environment is ready, just click run button and enjoy!',
      },
    },
  ]);
  const editorRef = useRef<any>(null);

  socket.on('codechange', (newValue: string) => {
    setCodeValue(newValue);
  });

  socket.on('language_change', (data: SLanguageChangeEventInput) => {
    const { id, mode: newMode, codeValue: newCodeValue } = data;
    setLangId(id);
    setMode(newMode);
    setCodeValue(newCodeValue);
  });

  // socket.on('codeselectionchange', (newRange: Ace.Range) => {
  //   if (editorRef && editorRef.current) {
  //     editorRef.current.editor.selection.setRange(newRange);
  //   }
  // });

  // useEffect(() => {
  //   editorRef?.current?.editor.gotoLine(4, 4);
  // }, []);

  const onChange = (newValue: any) => {
    setCodeValue(newValue);
    socket.emit('codechange', newValue);
  };

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const id = e.target.value;
    const langData = languageDataWithKeys[id];
    const { mode: newMode, defaultValue: newCodeValue } = langData;
    setLangId(+id);
    setMode(newMode);
    setCodeValue(newCodeValue);
    socket.emit('language_change', {
      id,
      mode: newMode,
      codeValue: newCodeValue,
      userName,
    });
  };
  // const onSelectionChange = (selection: any) => {
  //   // const content = editorRef.current.editor.session.getTextRange(
  //   //   selection.getRange(),
  //   // );
  //   socket.emit('codeselectionchange', selection.getRange());
  // };

  const submitCode = async (id: number, sourceCode: string | undefined) => {
    const response: any = await axios.request({
      method: 'POST',
      url: `${judgeUrl}/submissions`,
      data: {
        languageId: id,
        sourceCode: sourceCode,
      },
    });
    console.log('compile: ', response);
    return response.data.token;
  };

  // todo pull axios stuff into another util file and convert to async await
  const onRunClick = async () => {
    const language = languageDataWithKeys[langId].name;

    const deepClonedObject = cloneDeep(stdoutOutput);
    deepClonedObject.push({ type: 'coderun', payload: { userName, langId } });
    setStdoutOutput(deepClonedObject);

    setIsCompiling(true);
    let token;
    try {
      token = await submitCode(langId, codeValue);
    } catch (err) {
      console.log(err);
      setIsCompiling(false);
      setCodeError(err);
      setIsError(true);
      return;
    }
    await delay(5000);
    await axios
      .request({
        method: 'GET',
        url: `${judgeUrl}/submissions/${token}`,
      })
      .then(response => {
        const { data } = response.data;
        const { stderr, status, stdout, compile_output: compileOutput } = data;
        console.log('results', response);
        if (status && [1, 2, 3].includes(status.id)) {
          console.log(stdout);
          setIsCompiling(false);
          deepClonedObject.push({
            type: 'coderunresult',
            payload: { result: stdout },
          });
          setStdoutOutput(deepClonedObject);
          console.log(deepClonedObject);
          // setStdoutOutput([
          //   ...stdoutOutput,
          //   userRanPrompt,
          //   <Text key={Math.random()}>{stdout}</Text>,
          // ]);
        } else if (compileOutput) {
          console.log(compileOutput);
          setIsCompiling(false);
          setCodeError(stderr);
          setIsError(true);
        } else if (stderr) {
          console.log(stderr);
          setIsCompiling(false);
          setCodeError(stderr);
          setIsError(true);
        } else {
          console.log('something else happened');
          setIsCompiling(false);
        }
      })
      .catch(error => {
        console.log(error);
        setIsCompiling(false);
        setIsError(true);
      });
  };
  const Terminal = () => {
    return (
      <Flex
        color='white'
        minWidth='30%'
        width='30%'
        flex='1'
        bg='#272822'
        padding={5}
        direction='column'
      >
        {stdoutOutput.map((item: any) => {
          if (item.length === 3) console.log('object', item);
          const { type, payload } = item;
          if (type === 'message') {
            const { data } = payload;
            return <Text key={Math.random()}>{data}</Text>;
          } else if (type === 'coderun') {
            const { userName: userWhoRan, langId: newLangId } = payload;
            const langName = languageDataWithKeys[newLangId]?.name;
            return (
              <Text key={Math.random()}>
                User{' '}
                <Text as='span' color='#3182CE'>
                  {userWhoRan}
                </Text>{' '}
                ran
                <Text as='span' color='#38A169'>
                  {' '}
                  {langName}
                </Text>{' '}
                code just now.
              </Text>
            );
          } else if (type === 'coderunresult') {
            const { result } = payload;
            return <Text key={Math.random()}>{result}</Text>;
          }
          return null;
        })}
      </Flex>
    );
  };

  return (
    <Flex height='100%' width='100%' className='container'>
      <Resizable
        defaultSize={{
          width: '70%',
          height: '100%',
        }}
        style={{ borderRight: '10px solid #202020' }}
        maxWidth='70%'
        minWidth='30%'
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <Flex
          direction='column'
          position='relative'
          height='100%'
          width='100%'
          bg='cornsilk'
          className='code-editor-comp'
        >
          <Flex
            color='white'
            padding='10px'
            className='code-header'
            bg='#202020'
          >
            <Button
              colorScheme='blue'
              size='sm'
              onClick={onRunClick}
              disabled={isCompiling}
            >
              <HStack>
                <Box>Run</Box>
                {isCompiling ? (
                  <Spinner size='sm' />
                ) : (
                  <Box>
                    <FaPlay fontSize='10px' />
                  </Box>
                )}
              </HStack>
            </Button>
            <Select
              cursor='pointer'
              ml={5}
              size='sm'
              width='7rem'
              borderRadius='0.375rem'
              value={langId}
              onChange={onLanguageChange}
            >
              {Object.keys(languageDataWithKeys).map(id => {
                const langData = languageDataWithKeys[id];
                return (
                  <option
                    key={id}
                    value={id}
                    style={{ backgroundColor: '#202020' }}
                  >
                    {langData.name}
                  </option>
                );
              })}
            </Select>
            <Select
              cursor='pointer'
              ml={5}
              size='sm'
              width='10rem'
              borderRadius='0.375rem'
              value={theme}
              onChange={e => {
                const newTheme = e.target.value;
                setTheme(newTheme);
              }}
            >
              {themes.map(_theme => (
                <option
                  key={Math.random()}
                  value={_theme}
                  style={{ backgroundColor: '#202020' }}
                >
                  {_theme}
                </option>
              ))}
            </Select>
          </Flex>
          <AceEditor
            mode='java'
            theme='monokai'
            height='100%'
            width='100%'
            onChange={onChange}
            name='CODEEDITOR'
            editorProps={{ $blockScrolling: true }}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            focus={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            value={codeValue}
          />
        </Flex>
      </Resizable>
      <Terminal />
    </Flex>
  );
};

export default CodeEditor;
