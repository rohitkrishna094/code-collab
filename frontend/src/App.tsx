import { ChakraProvider, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import PlayGround from './components/playground/PlayGround';
import Home from './components/Home/Home';

function App() {
  return (
    <ChakraProvider>
      {/* <PlayGround /> */}
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/:roomId' component={PlayGround} />
        </Switch>
      </Router>
    </ChakraProvider>
  );
}

export default App;
