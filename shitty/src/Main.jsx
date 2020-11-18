import React from 'react'

import {
    Container,
    Header,
    Body,
    Content,
    Aside,
    Footer
} from 'react-holy-grail-layout'
import { ShellBar, ShellBarItem, Avatar, SideNavigation, SideNavigationItem, FlexBox, FlexBoxDirection, Button } from "@ui5/webcomponents-react";


export function Main() {
    const handleMenuButton = () =>{
        const sideNavigation = document.sideNavigation.collapsed.value;
        //alert(sideNavigation.collapsed);
    };

    return (
        <Container>
        <Header>
            <ShellBar 
                logo={<img src="henkel.jpg" />}
                profile={<Avatar image="ff2.jpg" />}
                primaryTitle="SHITS"
                >
            <ShellBarItem icon="add" text="Add" />
            <Button icon="menu" slot="startButton" id="startButton" onClick={handleMenuButton}></Button>
        </ShellBar>
        </Header>
        <Body>
            <Content bg="lightblue" p={2}>
                Content
            </Content>
            <Aside left primary>
                <SideNavigation id="sideNavigation" collapsed="false">
                    <SideNavigationItem text="Home" icon="home"></SideNavigationItem>
                    <SideNavigationItem text="Chemical" icon="lab"></SideNavigationItem>
                    <SideNavigationItem text="Employee" icon="employee"></SideNavigationItem>
                    <SideNavigationItem text="Waste" icon="delete"></SideNavigationItem>
                    <SideNavigationItem text="Settings" icon="customize"></SideNavigationItem>
                    <SideNavigationItem slot="fixedItems" text="Administration" icon="customize"></SideNavigationItem>
                </SideNavigation>
            </Aside>
            <Aside bg="orange" right p={2}>
                Right
            </Aside>
        </Body>
        <Footer bg="yellow" p={2}>
            Footer
        </Footer>
        
    </Container>);
}

fce