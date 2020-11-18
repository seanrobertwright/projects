import React from 'react';
import {
  Container,
  Header,
  Body,
  Content,
  Aside,
  Footer
} from 'react-holy-grail-layout';
import 'office-ui-fabric-react/dist/css/fabric.css';
import './App.css';
import { ShellBar, ShellBarItem, Avatar, SideNavigation, SideNavigationItem, FlexBox, FlexBoxDirection, Button } from "@ui5/webcomponents-react";

import Navigation from './Navigation';
import CardsSection from './CardsSection';
import OperationsTable from './OperationsTable';


function App() {
  return (
    <Container>
      <Header bg="lightgreen" p={2}>
        Header
      </Header>
      <Body>
        <Content bg="lightblue" p={2}>
          Content
        </Content>
        <Aside bg="pink" left primary p={2}>
          Left
        </Aside>
        <Aside bg="orange" right p={2}>
          Right
        </Aside>
      </Body>
      <Footer bg="yellow" p={2}>
        Footer
      </Footer>
    </Container>
  );
}

export default App;
