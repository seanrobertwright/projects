import React, { Component } from 'react'
import {
    Container,
    Header,
    Body,
    Content,
    Aside,
    Footer
} from 'react-holy-grail-layout'
import { ShellBar, ShellBarItem, Avatar, SideNavigation, SideNavigationItem, FlexBox, FlexBoxDirection, Button } from "@ui5/webcomponents-react";

export class Main extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             navExpanded: false
        }
    }

    menuClicked() {
        this.setState({
            navExpanded: !this.state.navExpanded
        })
    }
    render() {
        return (
            <div>
                <Container>
                    <Header>
                        <ShellBar 
                            logo={<img src="henkel.jpg" />}
                            profile={<Avatar image="ff2.jpg" />}
                            primaryTitle="SHITS"
                            >
                            <ShellBarItem icon="add" text="Add" />
                            <Button icon="menu" slot="startButton" id="startButton" onClick={() =>this.menuClicked()}></Button>
                        </ShellBar>
                    </Header>
                    <Body>
                        <Content right p={2}>
                            Content
                        </Content>
                        <Aside left width={1}>
                            <SideNavigation collapsed={this.state.navExpanded}>
                                <SideNavigationItem text="Home" icon="home"></SideNavigationItem>
                                <SideNavigationItem text="Chemical" icon="lab"></SideNavigationItem>
                                <SideNavigationItem text="Employee" icon="employee"></SideNavigationItem>
                                <SideNavigationItem text="Waste" icon="delete"></SideNavigationItem>
                                <SideNavigationItem text="Settings" icon="customize"></SideNavigationItem>
                                <SideNavigationItem slot="fixedItems" text="Administration" icon="customize"></SideNavigationItem>
                            </SideNavigation>
                        </Aside>
                    </Body>
                    <Footer p={2}>
                        Status
                    </Footer>          
                </Container>);
            </div>
        )
    }
}

export default Main
