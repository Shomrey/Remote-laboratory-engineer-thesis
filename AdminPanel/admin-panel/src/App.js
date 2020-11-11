import React, {Component} from 'react';
import './App.css';
import './components/lectures/DisplayExistingLecturesComponent';
import DisplayExistingLecturesComponent from './components/lectures/DisplayExistingLecturesComponent';
import SimpleTabs from './components/SimpleTab';
import CreateNewLectureComponent from './components/lectures/CreateNewLectureComponent';
import DisplayStudentsComponent from './components/students/DisplayStudentsComponent';
import CreateNewUserComponent from './components/students/CreateNewUserComponent';
import AddStudentToLectureComponent from './components/lectures/student_in_lab/AddStudentToLectureComponent';
import LoginComponent from './components/LoginComponent';

class App extends Component {

    state = {
        token: "",
        tabValue: 0,
        activeCard: 0
    }

    passValueFunction = (value) => {
        this.setState({activeCard: value});
    }

    getTokenFromAuth = (tokenValue) => {
        this.setState({token: tokenValue});
    }

    render() {
        let header;
        let activePage;
        if (this.state.token !== "") {
            header = <SimpleTabs passValueFunction={this.passValueFunction}/>
            if (this.state.activeCard === 0) {
                activePage = <DisplayExistingLecturesComponent/>
            }
            if (this.state.activeCard === 1) {
                activePage = <CreateNewLectureComponent/>
            }
            if (this.state.activeCard === 2) {
                activePage = <DisplayStudentsComponent/>
            }
            if (this.state.activeCard === 3) {
                activePage = <CreateNewUserComponent/>
            }
            if (this.state.activeCard === 4) {
                activePage = <AddStudentToLectureComponent/>
            }
        } else {
            activePage = <LoginComponent tokenPass={this.getTokenFromAuth}/>
        }
        return (
            <div>
                {header}
                {activePage}
            </div>
        );
    }
}

export default App;
