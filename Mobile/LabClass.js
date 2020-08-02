import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text, View, Button, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'

const labDetails = {
    introduction: "The Spanning Tree Protocol (STP) is a network protocol that builds a loop-free logical topology for Ethernet networks. The basic function of STP is to prevent bridge loops and the broadcast radiation that results from them. Spanning tree also allows a network design to include backup links providing fault tolerance if an active link fails. As the name suggests, STP creates a spanning tree that characterizes the relationship of nodes within a network of connected layer-2 bridges, and disables those links that are not part of the spanning tree, leaving a single active path between any two network nodes. STP is based on an algorithm that was invented by Radia Perlman while she was working for Digital Equipment Corporation.",
    tasks: [
        "1. Connect three switches in a way that causes a loop\n",
        "2. Observe a broadcast storm\n",
        "3. Enable spanning tree protocol\n",
        "4. Check results\n"
    ]
}

const Tab = createMaterialTopTabNavigator();

export default function LabClass(props) {
    const lab = props.route.params.lab;

    return (
        <Tab.Navigator>
            <Tab.Screen name={Platform.OS === 'ios' ? "Intro" : "Introduction"} component={LabIntroduction}
                        initialParams={{description: lab.description, topology: lab.topology}}/>
            <Tab.Screen name="Tasks" component={LabTasks} initialParams={{tasks: lab.tasks}}/>
            <Tab.Screen name="Terminal" component={LabTerminal}/>
        </Tab.Navigator>
    )
}

function LabIntroduction(props) {
    const {description, topology} = props.route.params;

    return (
        <View style={styles.tabContainer}>
            <Text style={styles.text}>{description}</Text>
            <Text>{'\n'}</Text>
            <Text style={styles.text}>{'Topology: \n' + topology}</Text>
        </View>
    )
}

function LabTasks(props) {
    const tasks = props.route.params.tasks;

    return (
        <View style={styles.tabContainer}>
            <Text style={styles.text}>{tasks ? tasks.replace(/#/gi, '\n'): ''}</Text>
        </View>
    )
}

function LabTerminal() {
    return (
        <View style={styles.tabContainer}>
            <View style={styles.terminalWindow}>
                <Text style={styles.terminalText}>
                    &gt;&gt;enable
                    <Text>{'\n'}</Text>
                    &gt;&gt;conf t
                </Text>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={140}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <TextInput style={styles.textInput} placeholder="Write your commands here"/>
                    </View>
                    <Icon name="play-arrow" size={60} onPress={() => {
                    }}/>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        padding: 13,
        height: '100%',
    },
    text: {
        fontSize: 16
    },
    terminalWindow: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        flex: 1
    },
    input: {
        borderColor: 'black',
        borderWidth: 1,
        width: '80%',
        justifyContent: 'center',
        paddingLeft: 10
    },
    button: {},
    inputContainer: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    textInput: {
        fontSize: 16
    },
    terminalText: {
        fontSize: 16
    }
});

