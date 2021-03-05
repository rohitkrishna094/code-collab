import React, { useEffect, useReducer, useRef, useState } from 'react';
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
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
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
import {
  CODE_CHANGE,
  CODE_RUN,
  CODE_RUN_RESULT,
  LANGUAGE_CHANGE,
  socket,
} from '../../socket';

// Object.keys(languageDataWithKeys).forEach(key => {
//   const languageData = languageDataWithKeys[key];
//   const { mode } = languageData;
//   require(`ace-builds/src-noconflict/mode-${mode}`);
//   require(`ace-builds/src-noconflict/snippets/${mode}`);
// });
// themes.forEach(theme => require(`ace-builds/src-noconflict/theme-${theme}`));

interface CodeEditorProps {
  userName: string;
}

// socket io event types, S stands for socket io
interface SLanguageChangeEvent {
  id: number;
  mode: string;
  codeValue: string;
  userName: string;
}
interface SCodeRunEvent {
  type: string;
  payload: { userName: string; langId: number };
}

interface SCodeRunResultEvent {
  type: string;
  payload: { result: string };
}

// dispatch consts A stands for Action Type
enum STDOUT_TYPES {
  A_LANGUAGE_CHANGE,
  A_MESSAGE,
  A_CODE_RUN_RESULT,
  A_CODE_RUN,
}

const getDefaultMode = (id: string) => {
  const data = languageDataWithKeys[id];
  if (data && data.defaultValue) return data.defaultValue;
};

const getDefaultLangId = () => 62;

const initialTerminalState = [
  {
    type: STDOUT_TYPES.A_MESSAGE,
    payload: {
      data: 'Environment is ready, just click run button and enjoy!',
    },
  },
];

const CodeEditor = ({ userName }: CodeEditorProps) => {
  const [mode, setMode] = useState('java');
  const [langId, setLangId] = useState(getDefaultLangId());
  const [codeValue, setCodeValue] = useState(getDefaultMode(langId + ''));
  const [theme, setTheme] = useState('monokai');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isError, setIsError] = useState(false);
  const [codeError, setCodeError] = useState('');
  // const [stdoutOutput, setStdoutOutput] = useState<any>(initialTerminalState);
  const editorRef = useRef<any>(null);

  const TerminalReducer = (state: any, action: any) => {
    const { type, payload } = action;
    const newState = cloneDeep(state);
    if (type === STDOUT_TYPES.A_MESSAGE) {
      const { data } = payload;
      newState.push({ type: STDOUT_TYPES.A_MESSAGE, payload: { data } });
      return newState;
    } else if (type === STDOUT_TYPES.A_CODE_RUN) {
      const { userName: userWhoRan } = payload;
      newState.push({
        type: STDOUT_TYPES.A_CODE_RUN,
        payload: { userName: userWhoRan, langId },
      });
      return newState;
    } else if (type === STDOUT_TYPES.A_CODE_RUN_RESULT) {
      const { result } = payload;
      newState.push({
        type: STDOUT_TYPES.A_CODE_RUN_RESULT,
        payload: { result },
      });
      return newState;
    } else if (type === STDOUT_TYPES.A_LANGUAGE_CHANGE) {
      const { userName: userWhoChanged, language } = payload;
      newState.push({
        type: STDOUT_TYPES.A_LANGUAGE_CHANGE,
        payload: { userName: userWhoChanged, language },
      });
      return newState;
    }
    return state;
  };

  const [stdoutOutput, dispatchStdoutOutput] = useReducer(
    TerminalReducer,
    initialTerminalState,
  );

  useEffect(() => {
    socket.on(CODE_CHANGE, (newValue: string) => {
      setCodeValue(newValue);
    });

    socket.on(CODE_RUN, (data: SCodeRunEvent) => {
      dispatchStdoutOutput(data);
    });

    socket.on(LANGUAGE_CHANGE, (data: SLanguageChangeEvent) => {
      const {
        id,
        mode: newMode,
        codeValue: newCodeValue,
        userName: userWhoChanged,
      } = data;
      const language = languageDataWithKeys[id]?.name;
      setLangId(id);
      setMode(newMode);
      setCodeValue(newCodeValue);
      dispatchStdoutOutput({
        type: STDOUT_TYPES.A_LANGUAGE_CHANGE,
        payload: { userName: userWhoChanged, language },
      });
    });

    socket.on(CODE_RUN_RESULT, (data: SCodeRunResultEvent) => {
      dispatchStdoutOutput(data);
    });

    // use effect cleanup
    return () => {
      socket.off(CODE_CHANGE);
      socket.off(CODE_RUN);
      socket.off(LANGUAGE_CHANGE);
    };
  }, []);

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
    socket.emit(CODE_CHANGE, newValue);
  };

  const onLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const id = e.target.value;
    const langData = languageDataWithKeys[id];
    const { mode: newMode, defaultValue: newCodeValue } = langData;
    setLangId(+id);
    setMode(newMode);
    setCodeValue(newCodeValue);
    dispatchStdoutOutput({
      type: STDOUT_TYPES.A_LANGUAGE_CHANGE,
      payload: { userName, language: langData.name },
    });
    socket.emit(LANGUAGE_CHANGE, {
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
    try {
      setIsCompiling(true);
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
    } catch (err) {
      console.log('Error while submitting', err);
      setIsCompiling(false);
      setCodeError(err);
      setIsError(true);
    }
  };

  const queryResults = async (token: string | undefined) => {
    if (!token) {
      setIsCompiling(false);
      setIsError(true);
      return;
    }

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
          console.log('we got stdout', stdout);
          setIsCompiling(false);
          const codeResultAction = {
            type: STDOUT_TYPES.A_CODE_RUN_RESULT,
            payload: { result: stdout },
          };
          dispatchStdoutOutput(codeResultAction);
          socket.emit(CODE_RUN_RESULT, codeResultAction);
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

  // todo pull axios stuff into another util file and convert to async await
  const onRunClick = async () => {
    const codeRunAction = {
      type: STDOUT_TYPES.A_CODE_RUN,
      payload: { userName, langId },
    };
    dispatchStdoutOutput(codeRunAction);
    socket.emit(CODE_RUN, codeRunAction);

    const token = await submitCode(langId, codeValue);

    await delay(5000);
    await queryResults(token);
  };

  const Terminal = () => {
    return (
      <Flex
        color='white'
        minWidth='30%'
        width='30%'
        flex='1'
        bg='#272822'
        direction='column'
        height='100%'
        padding={5}
      >
        {stdoutOutput.map((item: any) => {
          const { type, payload } = item;
          if (type === STDOUT_TYPES.A_MESSAGE) {
            const { data } = payload;
            return <Text key={Math.random()}>{data}</Text>;
          } else if (type === STDOUT_TYPES.A_CODE_RUN) {
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
          } else if (type === STDOUT_TYPES.A_CODE_RUN_RESULT) {
            const { result } = payload;
            return (
              <Text key={Math.random()} whiteSpace='pre'>
                {result}
              </Text>
            );
          } else if (type === STDOUT_TYPES.A_LANGUAGE_CHANGE) {
            const { userName: userWhoChanged, language } = payload;
            return (
              <Text key={Math.random()}>
                User{' '}
                <Text as='span' color='#3182CE'>
                  {userWhoChanged}
                </Text>{' '}
                changed language to
                <Text as='span' color='#38A169'>
                  {' '}
                  {language}
                </Text>
              </Text>
            );
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
          <Flex color='white' padding={2} className='code-header' bg='#202020'>
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
            mode={mode}
            theme={theme}
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
