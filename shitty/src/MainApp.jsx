import React from "react";

import '@ui5/webcomponents-icons/dist/icons/add.js';
import '@ui5/webcomponents-icons/dist/icons/home.js';
import '@ui5/webcomponents-icons/dist/icons/lab.js';
import '@ui5/webcomponents-icons/dist/icons/employee.js';
import '@ui5/webcomponents-icons/dist/icons/delete.js';
import '@ui5/webcomponents-icons/dist/icons/customize.js';
import '@ui5/webcomponents-icons/dist/icons/menu.js';

import { ShellBar, ShellBarItem, Avatar, SideNavigation, SideNavigationItem, FlexBox, FlexBoxDirection, Button } from "@ui5/webcomponents-react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { Home } from "./Home";
import { Detail } from "./Detail";
import { useHistory } from "react-router-dom";

export function MainApp() {
    const history = useHistory();
    const handleLogoClick = () => {
        history.push("./");
    };
    return (<>
            <ShellBar 
                logo={<img src="henkel.jpg" />}
                profile={<Avatar image="ff2.jpg" />}
                primaryTitle="SHITS"
                onLogoClick={handleLogoClick}>
                    <ShellBarItem icon="add" text="Add" />
                    <Button icon="menu" slot="startButton" id="startButton"></Button>
            </ShellBar>
            <FlexBox height="100%" direction={FlexBoxDirection.Row}>
            
           
            <SideNavigation>
                <SideNavigationItem text="Home" icon="home"></SideNavigationItem>
                <SideNavigationItem text="Chemical" icon="lab"></SideNavigationItem>
                <SideNavigationItem text="Employee" icon="employee"></SideNavigationItem>
                <SideNavigationItem text="Waste" icon="delete"></SideNavigationItem>
                <SideNavigationItem text="Settings" icon="customize"></SideNavigationItem>
                <SideNavigationItem slot="fixedItems" text="Administration" icon="customize"></SideNavigationItem>
            </SideNavigation>

            <Switch>
                <Route path="/home" component={Home} />
                <Route path="/detail" component={Detail} />
                <Redirect from="/" to="/home" />
            </Switch>
            </FlexBox>
            <script>
                const sideNavigation = document.querySelector("SideNavigation");
                document.querySelector("#startButton").addEventListener("click", event => sideNavigation.collapse = !sideNavigation.collapsed);
            </script>
            </>
    );
}