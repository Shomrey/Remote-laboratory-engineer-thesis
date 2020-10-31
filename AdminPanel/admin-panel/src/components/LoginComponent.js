import React, { Component } from 'react';
import SignIn from './SignIn';

class LoginComponent extends Component {
    state = { token: "" }
    getTokenFromAuth = (tokenValue) => {
        this.setState({ token: tokenValue });
        this.props.tokenPass(tokenValue);
    }
    render() {
        return (
            <SignIn tokenPass={this.getTokenFromAuth} />
        );
    }
}

export default LoginComponent;