import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
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
        let columns = [{ field: 'firstname', headerName: 'First name', width: 50 },
        { field: 'surname', headerName: 'Surname', width: 50 },
        { field: 'mail', headerName: 'Email', width: 50 }];
        return (
            <Container>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Lecture title</strong></TableCell>
                                <TableCell><strong>Date</strong></TableCell>
                                <TableCell><strong>Teacher</strong></TableCell>
                                <TableCell><strong>Edit lecture details</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.labs.map((lecture, index) => (
                                <TableRow key={index}>
                                    <TableCell align="left">{lecture.title}</TableCell>
                                    <TableCell align="left">{lecture.date}</TableCell>
                                    <TableCell align="left">{lecture.teacher.name} {lecture.teacher.surname}</TableCell>
                                    <TableCell align="left"> <Button variant="contained" color="primary" id={index} onClick={() => this.handleClick(index)}>Edit</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

            </Container>
        );
    }
}

/*<List>
                    {this.props.labs.map((lecture, index) => <ListItem> <Button variant="contained" color="primary" id={index} onClick={() => this.handleClick(index)}>{lecture.title}</Button></ListItem>)}
                </List> */

export default ChooseLabComponent;