import React, { Component } from 'react';
import { MenuList, MenuItem } from '@material-ui/core'

class NavigationComponent extends Component {
    state = {}
    render() {
        return (<MenuList color='primary'>
            <MenuItem style={{ backgroundColor: 'primary' }} button onClick={() => this.props.passValueFunction(0)}>Lectures</MenuItem>
            <MenuItem button onClick={() => this.props.passValueFunction(2)}>Students</MenuItem>
            <MenuItem>Live</MenuItem>
        </MenuList>);
    }
}

export default NavigationComponent;