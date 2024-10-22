import React, { Component } from 'react';
import './App.css';
import './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import DisplayExistingLecturesComponent from './components/lectures/display_lectures/DisplayExistingLecturesComponent';
import Axios from 'axios';
import { Grid } from '@material-ui/core';
import DisplayStudentsComponent from './components/students/DisplayStudentsComponent';
import LoginComponent from './components/LoginComponent';
import NavigationComponent from './components/NavigationComponent';
import LiveComponent from './components/lectures/live/LiveComponent';
import logo from './resources/agh_logo_small.jpg';

class App extends Component {

  state = {
    token: "",
    tabValue: 0,
    activeCard: 0,
    counter: 0,
    userName: '',
    userNameReady: false
  }

  passValueFunction = (value) => {
    console.log(value);
    this.setState({ activeCard: value });
  }

  getTokenFromAuth = (tokenValue) => {
    this.setState({ token: tokenValue });
    const url = "https://remote-laboratory.herokuapp.com/api/users/current";
    Axios.get(url).then(response => {
      let tmp = response.data.name + ' ' + response.data.surname;
      this.setState({ userName: tmp, userNameReady: true });
    }
    )
  }

  render() {
    let activePage;
    let page;
    if (this.state.token !== "") {
      if (this.state.activeCard === 0) {
        activePage = <DisplayExistingLecturesComponent />
      }
      if (this.state.activeCard === 1) {
        activePage = <DisplayStudentsComponent />
      }
      if (this.state.activeCard === 2) {
        activePage = <LiveComponent />
      }
      page = <Grid container spacing={0}  >
        <Grid item xs={2}><div style={{ backgroundColor: '#eceff1', height: '80px', borderBottom: '1px solid #aaa' }}>{this.state.userNameReady ? this.state.userName : ""}</div></Grid>
        <Grid item xs={9}><div style={{ backgroundColor: '#eceff1', height: '80px', borderBottom: '1px solid #aaa' }}></div></Grid>
        <Grid item xs={1} ><div style={{ height: '80px', margin: 0, padding: 0, width: 'auto', alignItems: 'right', justifyContent: 'right', borderBottom: '1px solid #aaa' }}><img style={{ margin: '2px', alignItems: 'right' }} src={logo} /></div></Grid>
        <Grid item xs={2}>
          {
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
