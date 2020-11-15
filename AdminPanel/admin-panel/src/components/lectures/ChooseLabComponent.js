import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Container } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

class ChooseLabComponent extends Component {
    state = {}

    handleClick = (index) => {
        console.log(index);
        console.log("from chooselab: " + index);
        this.props.handleChoice(index);
    }
    render() {
        return (
            <Container>
                <List>
                    {this.props.labs.map((lecture, index) => <ListItem> <Button variant="contained" color="primary" id={index} onClick={() => this.handleClick(index)}>{lecture.title}</Button></ListItem>)}
                </List>
            </Container>
        );
    }
}

export default ChooseLabComponent;