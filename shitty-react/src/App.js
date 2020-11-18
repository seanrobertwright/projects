import React from 'react';
import './App.css';
//import { Main } from "./Main";
import { ThemeProvider } from "styled-components";
import { 
  Container,
  Header,
  Body,
  Content,
  Aside,
  Footer
} from 'react-holy-grail-layout'
import { ShellBar, ShellBarItem, Avatar, SideNavigation, SideNavigationItem, FlexBox, FlexBoxDirection, Button } from "@ui5/webcomponents-react";

function App() {
  return (
    <Container>
    <Header bg="lightgreen" p={2}>
    <ShellBar 
      logo={<img src="henkel.jpg" />}
      profile={<Avatar image="ff2.jpg" />}
      primaryTitle="SHITS"
      onLogoClick={handleLogoClick}>
          <ShellBarItem icon="add" text="Add" />
          <Button icon="menu" slot="startButton" id="startButton"></Button>
    </ShellBar>
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
