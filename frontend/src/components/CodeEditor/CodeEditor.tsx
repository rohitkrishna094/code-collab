import React, { useEffect, useReducer, useRef, useState } from 'react';
import AceEditor from 'react-ace';
import {
  Box,
  Button,
  Flex,
  HStack,
  Select,
  Spinner,
  Tooltip,
} from '@chakra-ui/react';
import axios from 'axios';
import { FaPlay } from 'react-icons/fa';
import { FiDownloadCloud, FiUploadCloud } from 'react-icons/fi';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/webpack-resolver';
import {
  themes,
  languageDataWithKeys,
  getExtensionByLangId,
} from './editorData';
import { judgeUrl } from '../../api/apiInfo';
import { delay } from '../../utils';
import { Resizable } from 're-resizable';
import { Ace } from 'ace-builds';

import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-clojure';
import 'ace-builds/src-noconflict/mode-csharp';
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
  SCodeRunEvent,
  SCodeRunResultEvent,
  SLanguageChangeEvent,
  socket,
} from '../../socket';
import { STDOUT_TYPES } from '../../actionTypes';
import Terminal from '../Terminal/Terminal';
import Chat, { ChatToggle } from '../Chat/Chat';
import TerminalReducer, {
  initialTerminalState,
} from '../../store/reducers/TerminalReducer';
import { isNotBlank } from '../../utils/stringUtils';

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

const getDefaultMode = (id: string) => {
  const data = languageDataWithKeys[id];
  if (data && data.defaultValue) return data.defaultValue;
};

const getDefaultLangId = () => 62;

const CodeEditor = ({ userName }: CodeEditorProps) => {
  const [mode, setMode] = useState('java');
  const [langId, setLangId] = useState(getDefaultLangId());
  const [codeValue, setCodeValue] = useState(getDefaultMode(langId + ''));
  const [theme, setTheme] = useState('monokai');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isError, setIsError] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const editorRef = useRef<any>(null);

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

  const onChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

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
        if (status && [1, 2, 3].includes(status.id) && isNotBlank(stdout)) {
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
          const codeResultAction = {
            type: STDOUT_TYPES.A_CODE_RUN_RESULT,
            payload: { result: compileOutput },
          };
          dispatchStdoutOutput(codeResultAction);
          socket.emit(CODE_RUN_RESULT, codeResultAction);

          setIsCompiling(false);
          setCodeError(stderr);
          setIsError(true);
        } else if (stderr) {
          console.log(stderr);
          const codeResultAction = {
            type: STDOUT_TYPES.A_CODE_RUN_RESULT,
            payload: { result: stderr },
          };
          dispatchStdoutOutput(codeResultAction);

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

    await delay(3000);
    await queryResults(token);
  };

  const onDownloadClick = (e: any) => {
    const aTag = document.createElement('a');
    const file = new Blob([codeValue as BlobPart], {
      type: 'text/plain;charset=utf-8',
    });
    aTag.href = URL.createObjectURL(file);
    aTag.download = `code-collab_${Date.now()}.${getExtensionByLangId(
      langId + '',
    )}`;
    aTag.click();
  };

  const onUploadClick = () => {
    console.log('object');
  };

  const CodeEditorHeader = (props: any) => {
    return (
      <Flex
        color='white'
        padding={2}
        bg='#202020'
        className='code-header'
        {...props}
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
        <Flex className='code-controls' color='white' ml='auto'>
          <Tooltip hasArrow label='Download'>
            <Button colorScheme='blue' size='sm' onClick={onDownloadClick}>
              <FiDownloadCloud fontSize='20px' />
            </Button>
          </Tooltip>
          <Tooltip hasArrow label='Upload'>
            <Button colorScheme='blue' size='sm' onClick={onUploadClick} ml={2}>
              <FiUploadCloud fontSize='20px' />
            </Button>
          </Tooltip>
        </Flex>
      </Flex>
    );
  };
  return (
    <>
      <ChatToggle
        isChatOpen={isChatOpen}
        onChatToggle={onChatToggle}
        style={{ marginTop: 'calc(-94px + 47px - 40px)' }}
      />
      <Chat shouldDisplay={isChatOpen} />
      <Flex
        height='100%'
        width={isChatOpen ? '75%' : '100%'}
        // width='100%'
        maxWidth='100vw'
        className='container'
        boxSizing='border-box'
        position='relative'
      >
        <Resizable
          defaultSize={{
            // width: '45%',
            width: '70%',
            height: '100%',
          }}
          style={{ borderRight: '10px solid #202020' }}
          maxWidth='70%'
          minWidth='40%'
          // size={{
          //   width: isChatOpen ? '45%' : '70%',
          //   height: '100%',
          // }}
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
          <CodeEditorHeader />
          <Flex
            direction='column'
            position='relative'
            height='100%'
            width='100%'
            bg='cornsilk'
          >
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
        <Terminal items={stdoutOutput} />
      </Flex>
    </>
  );
};

export default CodeEditor;
