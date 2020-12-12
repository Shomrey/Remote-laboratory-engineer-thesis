import React, { Component } from 'react';
import './App.css';
import './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import DisplayExistingLecturesComponent from './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import Axios from 'axios';
import { AppBar, Tabs, Tab, Grid, Container } from '@material-ui/core';
import { TabPanel, TabContext } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import SimpleTabs from './components/SimpleTab';
import CreateNewLectureComponent from './components/lectures/CreateNewLectureComponent';
import DisplayStudentsComponent from './components/students/DisplayStudentsComponent';
import CreateNewUserComponent from './components/students/CreateNewUserComponent';
import AddStudentToLectureComponent from './components/lectures/student_in_lab/AddStudentToLectureComponent';
import LoginComponent from './components/LoginComponent';
import NavigationComponent from './components/NavigationComponent';

/*const HeaderDiv = withStyles(theme => ({
  header: {
    backgroundColor: theme.palette.secondary.main
  }
}))(Container)*/

class App extends Component {

  state = {
    token: "",
    tabValue: 0,
    activeCard: 0,
    counter: 0
  }

  passValueFunction = (value) => {
    console.log(value);
    this.setState({ activeCard: value });
  }

  getTokenFromAuth = (tokenValue) => {
    this.setState({ token: tokenValue });
  }

  render() {
    //console.log(styles);
    let header;
    let activePage;
    let page;
    if (this.state.token !== "") {
      header = <SimpleTabs passValueFunction={this.passValueFunction} />
      if (this.state.activeCard === 0) {
        activePage = <DisplayExistingLecturesComponent />
      }
      if (this.state.activeCard === 1) {
        activePage = <CreateNewLectureComponent />
      }
      if (this.state.activeCard === 2) {
        activePage = <DisplayStudentsComponent />
      }
      if (this.state.activeCard === 3) {
        activePage = <CreateNewUserComponent />
      }
      if (this.state.activeCard === 4) {
        activePage = <AddStudentToLectureComponent />
      }
      page = <Grid container spacing={0}  >

        <Grid item xs={12} ><div style={{ backgroundColor: "#f44336", height: '80px', margin: 0, padding: 0, width: 'auto' }}>Header</div></Grid>
        <Grid item xs={2}>
          {
            //header
            <NavigationComponent passValueFunction={this.passValueFunction} />
          }
        </Grid>
        <Grid item xs={10}>
          {activePage}
        </Grid>
      </Grid>
    } else {
      page = <LoginComponent tokenPass={this.getTokenFromAuth} />
    }
    return (
      <div styles={{ margin: 0, padding: 0, height: "100%", minHeight: "100%" }}>
        { page}
      </div>
    );
  }
}

export default App;
