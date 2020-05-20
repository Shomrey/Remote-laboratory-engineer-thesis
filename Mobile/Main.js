import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import Home from './Home';
import Settings from './Settings';

const Drawer = createDrawerNavigator();

export default function Main({ navigation }) {
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={Home} />
            <Drawer.Screen name="Settings" component={Settings} />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({

});
