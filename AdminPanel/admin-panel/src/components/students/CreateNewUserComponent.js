import React, {Component} from 'react';
import Axios from 'axios';
import MultilineTextFields from './NewUserForm';
import {Button} from '@material-ui/core';

class CreateNewLectureComponent extends Component {
    state = {
        newUserData: {},
        currentUser: {},
        userLoaded: false
    }

    handleDataPass = (state) => {
        this.setState({newUserData: state});
    }

    sendRequest = () => {
        const url = "https://remote-laboratory.herokuapp.com/api/auth/register";
        let user = this.state.newUserData;
        user.userType = "student";
        Axios.post(url, user).then(response => console.log(response));
    }

    componentDidMount() {
        const url = "https://remote-laboratory.herokuapp.com/api/users/current";
        Axios.get(url).then(response => this.setState({currentUser: response.data}));
        this.setState({userLoaded: true});
    }

    render() {
        return (
            <div>
                <MultilineTextFields passNewUserData={this.handleDataPass}/>
                <Button disabled={!this.state.userLoaded} variant="contained" color="primary"
                        onClick={this.sendRequest}>Create user</Button>
            </div>
        );
    }
}

export default CreateNewLectureComponent;
