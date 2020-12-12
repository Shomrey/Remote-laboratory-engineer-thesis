import React, { Component } from 'react';
import { MenuList, MenuItem } from '@material-ui/core'

class NavigationComponent extends Component {
    state = {}
    render() {
        return (<div style={{ backgroundColor: "#757de8", height: "100%", fontColor: "white" }}><MenuList color='primary'>
            <MenuItem button onClick={() => this.props.passValueFunction(0)}>Lectures</MenuItem>
            <MenuItem button onClick={() => this.props.passValueFunction(2)}>Students</MenuItem>
            <MenuItem>Live</MenuItem>
        </MenuList></div>);
    }
}

export default NavigationComponent;