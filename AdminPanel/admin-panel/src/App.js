import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import DisplayExistingLecturesComponent from './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import Axios from 'axios';
import { AppBar, Tabs, Tab, Grid } from '@material-ui/core';
import { TabPanel, TabContext } from '@material-ui/lab';
import SimpleTabs from './components/SimpleTab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CreateNewLectureComponent from './components/lectures/CreateNewLectureComponent';
import DisplayStudentsComponent from './components/students/DisplayStudentsComponent';
import CreateNewUserComponent from './components/students/CreateNewUserComponent';
import AddStudentToLectureComponent from './components/lectures/student_in_lab/AddStudentToLectureComponent';
import LoginComponent from './components/LoginComponent';

function getToken() { }

class App extends Component {

  state = {
    token: "",
    tabValue: 0,
    activeCard: 0
  }

  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  passValueFunction = (value) => {
    this.setState({ activeCard: value });
  }

  handleChange(event, value) {
    this.setState({ tabValue: value })
  }

  /*componentDidMount() {
    const credentails = {
      "mail": "teacher@admin.com",
      "password": "adminpassword"
    }
    const url = "https://remote-laboratory.herokuapp.com/api/auth/login";
    Axios.post(url, credentails).then(response => {

      Axios.defaults.headers.common = {
        "Authorization": "Bearer " + response.data.access_token
      };
      this.setState({ token: response.data });
    })
  }*/

  getTokenFromAuth = (tokenValue) => {
    this.setState({ token: tokenValue });
  }

  render() {
    //if (this.state.token == "") return (<div>Loading</div>);
    //else
    let header;
    let activePage;
    if (this.state.token != "") {
      header = <SimpleTabs passValueFunction={this.passValueFunction} />
      if (this.state.activeCard == 0) { activePage = <DisplayExistingLecturesComponent /> }
      if (this.state.activeCard == 1) { activePage = <CreateNewLectureComponent /> }
      if (this.state.activeCard == 2) { activePage = <DisplayStudentsComponent /> }
      if (this.state.activeCard == 3) { activePage = <CreateNewUserComponent /> }
      if (this.state.activeCard == 4) { activePage = <AddStudentToLectureComponent /> }
    }
    else {
      activePage = <LoginComponent tokenPass={this.getTokenFromAuth} />
    }
    return (



      <Grid container spacing="3" justify="center" direction="column">
        <Grid item>
          {header}
        </Grid>
        <Grid item>
          {activePage}
        </Grid>
      </Grid>





      /*<div>
        <AppBar position="static">
          <Tabs value={this.state.tabValue} onChange={this.handleChange} aria-label="simple tabs example">
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
        </AppBar>
        <TabPanel value={this.state.tabValue} index={0}>
          Item One
</TabPanel>
        <TabPanel value={this.state.tabValue} index={1}>
          Item Two
</TabPanel>
        <TabPanel value={this.state.tabValue} index={2}>
          Item Three
</TabPanel>
      </div>*/
      //<DisplayExistingLecturesComponent token={this.state.token} />
      /*
      
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>*/
    );
  }
}

export default App;
