import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

const labDetails = {
    introduction: "Lorem ipsum ...",
    tasks: [
        "1. First task",
        "2. Second task",
        "3. Third task"
    ]
}

const Tab = createBottomTabNavigator();

export default function LabClass(props) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Introduction" component={LabIntroduction} />
            <Tab.Screen name="Tasks" component={LabTasks} />
            <Tab.Screen name="Terminal" component={LabTerminal} />
        </Tab.Navigator>
    )
}

function LabIntroduction() {
    return (
        <View>
            <Text> {labDetails.introduction} </Text>
        </View>
    )
}

function LabTasks() {
    return (
        <View>
            <Text> {labDetails.tasks} </Text>
        </View>
    )
}

function LabTerminal() {
    return (
        <View>
            <Text> Terminal </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    }
});