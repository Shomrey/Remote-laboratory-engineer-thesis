import React, { Component } from 'react';
import { MenuList, MenuItem } from '@material-ui/core'

class NavigationComponent extends Component {
    state = {}
    render() {
        return (<div style={{ backgroundColor: "#eceff1", height: "100%", fontColor: "white" }}><MenuList color='primary'>
            <MenuItem button onClick={() => this.props.passValueFunction(0)}>Laboratory classes</MenuItem>
            <MenuItem button onClick={() => this.props.passValueFunction(1)}>Users</MenuItem>
            <MenuItem button onClick={() => this.props.passValueFunction(2)}>Live</MenuItem>
        </MenuList></div>);
    }
}

export default NavigationComponent;