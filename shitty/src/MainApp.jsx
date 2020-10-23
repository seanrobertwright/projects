import React from "react";
import '@ui5/webcomponents-icons/dist/icons/add.js';
import { ShellBar, ShellBarItem, Avatar } from "@ui5/webcomponents-react";
import { Switch, Route, Redirect } from 'react-router-dom';
import { Home } from "./Home";
import {Detail } from "./Detail";
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
            
            </ShellBar>
            <Switch>
                <Route path="/home" component={Home} />
                <Route path="/detail" component={Detail} />
                <Redirect from="/" to="/home" />
            </Switch>
            </>
    );
}