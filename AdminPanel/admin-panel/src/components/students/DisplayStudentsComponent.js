import React, { Component } from 'react';
import Axios from 'axios';
import OneStudentDisplay from './OneStudentDisplay';
import SplitButton from './UserDisplayList';



class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        users: [],
        usersLoaded: false,
        currentUserIndex: 0
    }
    componentDidMount() {
        const url = "https://remote-laboratory.herokuapp.com/api/users";
        console.log("getting users");
        Axios.get(url).then(response => this.setState({ users: response.data.filter(user => user.userType == "student") }));
        this.setState({ usersLoaded: true });
    }

    handleClick = (e) => {
        e.preventDefault();
        this.state.users.map(user => console.log(user))
    }

    handleUserChoice = (index) => {
        this.setState({ currentUserIndex: index });
    }



    render() {
        let userToDisplayGuard;
        if (typeof (this.state.users[this.state.currentUserIndex]) != "undefined") userToDisplayGuard = <OneStudentDisplay userData={this.state.users[this.state.currentUserIndex]} />
        else userToDisplayGuard = "";
        return (
            <div>
                <SplitButton titleList={this.state.users.map(user => user.surname)} handleTitleChoice={this.handleUserChoice} />
                <a href="#" onClick={this.handleClick} >
                </a>
                {userToDisplayGuard}
            </div >
        );
    }
}

export default DisplayExistingLecturesComponent;