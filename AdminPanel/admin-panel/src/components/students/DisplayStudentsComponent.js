import React, { Component } from 'react';
import Axios from 'axios';
import OneStudentDisplay from './OneStudentDisplay';
import SplitButton from './UserDisplayList';
import { Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import CreateNewUserComponent from './CreateNewUserComponent';




class DisplayExistingLecturesComponent extends Component {// extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        users: [],
        usersLoaded: false,
        currentUserIndex: 0,
        nameSearchBar: "",
        surnameSearchBar: "",
        mailSearchBar: "",
        createUser: false
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

    compare = (a, b) => {
        if (a.surname > b.surname) return 1;
        if (b.surname > a.surname) return -1;
        return 0;
    }

    handleSearchBarChange = (evt) => {
        let name = [evt.target.name];
        let field = name + "SearchBar";
        console.log(field);
        console.log(this.state[field])
        this.setState({ [field]: evt.target.value })
    }

    toggleCreate = () => {
        let tmp = this.state.createUser;
        this.setState({ createUser: !tmp });
        console.log('toggle create');
    }



    render() {
        let userToDisplayGuard;
        if (this.state.createUser) {
            userToDisplayGuard = <div><CreateNewUserComponent />
                <Button variant="contained" color="primary" onClick={this.toggleCreate}>Cancel</Button>
            </div>
        }
        else if (typeof (this.state.users[this.state.currentUserIndex]) != "undefined") {
            let columns = [{ field: 'firstname', headerName: 'First name', width: 100 },
            { field: 'surname', headerName: 'Surname', width: 150 },
            { field: 'mail', headerName: 'Email', width: 150 }];
            console.log(this.state);
            userToDisplayGuard = <div>
                <Button variant="contained" color="primary" onClick={this.toggleCreate}>Create new createUser</Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><TextField name="name" onChange={this.handleSearchBarChange} label="First name" /></TableCell>
                                <TableCell><TextField name="surname" onChange={this.handleSearchBarChange} label="Surname" /></TableCell>
                                <TableCell><TextField name="mail" onChange={this.handleSearchBarChange} label="Mail" /></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.users.sort(this.compare)
                                .filter(user => user.name.includes(this.state.nameSearchBar))
                                .filter(user => user.surname.includes(this.state.surnameSearchBar))
                                .filter(user => user.mail.includes(this.state.mailSearchBar))
                                .map((user, listIndex) => (
                                    <TableRow key={listIndex}>
                                        <TableCell align="left">{user.name}</TableCell>
                                        <TableCell align="left">{user.surname}</TableCell>
                                        <TableCell align="left">{user.mail}</TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        }
        //<OneStudentDisplay userData={this.state.users[this.state.currentUserIndex]} />
        //<SplitButton titleList={this.state.users.map(user => user.surname)} handleTitleChoice={this.handleUserChoice} />
        //<a href="#" onClick={this.handleClick} >
        //</a>
        //<TableRow>
        //                  <TableCell><strong>First name</strong></TableCell>
        //                <TableCell><strong>Last name</strong></TableCell>
        //              <TableCell><strong>Email address</strong></TableCell>
        //        </TableRow>
        else userToDisplayGuard = "";
        return (
            <Container>

                {userToDisplayGuard}
            </Container >
        );
    }
}

export default DisplayExistingLecturesComponent;