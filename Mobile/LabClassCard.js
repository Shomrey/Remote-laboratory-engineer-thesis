import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function LabClassCard(props) {
    return (
        <TouchableOpacity onPress={() => props.navigation.navigate('LabClass', {lab: props.lab})} style={styles.touchable}>
            <View style={styles.content}>
                <Text style={styles.profName}>
                    {props.lab.teacher}
                </Text>
                <Text style={styles.labName}>
                    {props.lab.title}
                </Text>
                <Text style={styles.subject}>
                    {props.lab.date}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    touchable: {
        height: 112,
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: "#e6e6eb",
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6
    },
    content: {
        display: "flex",
        flexDirection: "column",
        padding: 16,
        flex: 1
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
        position: "absolute",
        bottom: 16,
        left: 16
    }
});