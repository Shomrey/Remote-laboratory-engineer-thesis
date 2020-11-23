import 'react-native-gesture-handler';
import React, {useContext, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import Dialog from 'react-native-dialog';
import Axios from 'axios';
import {AuthContext} from "../context/AuthContext";

export default function LabClassCard(props) {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [enrollmentCode, setEnrollmentCode] = useState('');
    const [token, setToken] = useContext(AuthContext);
    const [enrollButtonEnabled, setEnrollButtonEnabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const onPress = () => {
        if (props.enroll) {
            setDialogVisible(true);
        } else {
            props.navigation.navigate('LabClass', {lab: props.lab});
        }
    }

    return (
        <View>
            <TouchableOpacity onPress={onPress}
                              style={styles.touchable}>
                <View style={styles.content}>
                    <Text style={styles.profName}>
                        {`${props.lab.teacher.name} ${props.lab.teacher.surname}`}
                    </Text>
                    <Text style={styles.labName}>
                        {props.lab.title}
                    </Text>
                    <Text style={styles.subject}>
                        {props.lab.date}
                    </Text>
                </View>
            </TouchableOpacity>
            <Dialog.Container visible={dialogVisible}>
                <Dialog.Title>Enroll to laboratory</Dialog.Title>
                <Dialog.Input placeholder="enrollment code" autoCapitalize={"none"} onChangeText={text => setEnrollmentCode(text)}/>
                {errorMessage ? <Dialog.Description>{errorMessage}</Dialog.Description>: ''}
                <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)}/>
                <Dialog.Button label="Enroll" disabled={!enrollButtonEnabled} onPress={() => {
                    setEnrollButtonEnabled(false);

                    Axios.post(`https://remote-laboratory.herokuapp.com/api/users/current/labs/${props.lab.id}/enroll-with-code`,
                        {enrollmentCode},
                        {headers: {'Authorization': `Bearer ${token}`}})
                        .then(function (response) {
                            setDialogVisible(false);
                        })
                        .catch(function (error) {
                            setEnrollButtonEnabled(true);
                            if (error.response) {
                                if (error.response.status === 400) {
                                    setErrorMessage('Incorrect code');
                                } else {
                                    setErrorMessage('Failed to enroll');
                                }
                            } else {
                                setErrorMessage('Failed to enroll');
                            }
                        });
                }}/>
            </Dialog.Container>
        </View>
    )
}

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 25,
        marginTop: 15,
        marginHorizontal: 15,
        backgroundColor: "white",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 6.84,
        elevation: 10
    },
    content: {
        padding: 16,
    },
    profName: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
        color: "rgba(0, 0, 0, 0.6)",
    },
    labName: {
        fontSize: 24
    },
    subject: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
        color: "rgba(0, 0, 0, 0.6)",
        marginTop: 6
    }
});