import React, {useContext, useEffect, useState} from "react";
import Axios from "axios";
import {AuthContext} from "../context/AuthContext";
import {ScrollView, StyleSheet, Text, View} from "react-native";

export default function LabResult(props) {
    const [token, setToken] = useContext(AuthContext);
    const [labResult, setLabResult] = useState();
    const lab = props.route.params.lab;

    props.navigation.setOptions({headerBackTitle: 'Results'});

    useEffect(() => {
        Axios.get(`https://remote-laboratory.herokuapp.com/api/users/current/labs/${lab.id}/result`, {
            headers: {'Authorization': `Bearer ${token}`},
            params: {enrolled: true}
        })
            .then(function (response) {
                setLabResult(response.data);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        console.log('Failed to authenticate.')
                    } else {
                        console.log('Unknown server error.')
                    }
                } else {
                    console.log('Failed to connect to the server.')
                }
            });
    }, []);

    return (
        labResult ?
            <View style={styles.container}>
                <Text style={styles.score}>Score: {labResult.score}</Text>
                <Text style={styles.score}>Submitted result:</Text>
                <ScrollView style={styles.resultContainer}>
                    <Text style={styles.resultText}>
                        {labResult.result}
                    </Text>
                </ScrollView>
            </View>
            :
            <View/>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: '#eceff1',
        height: '100%'
    },
    score: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 20,
        marginHorizontal: 15
    },
    resultContainer: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        flex: 1,
        backgroundColor: 'black',
        margin: 25,
        marginBottom: 35
    },
    resultText: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'SourceCodePro_500Medium'
    },
});