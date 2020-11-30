import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';
import Settings from './Settings';
import {Icon} from "react-native-elements";
import Account from "./Account";
import Enroll from "./Enroll";

const Drawer = createDrawerNavigator();

export default function Main({navigation, logOut}) {

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={Home} options={{
                    drawerIcon: () => (<Icon name='home'/>),
                    unmountOnBlur: true
                }}/>
                <Drawer.Screen name="Enroll" component={Enroll} options={{
                    drawerIcon: () => (<Icon name='assignment'/>),
                    unmountOnBlur: true
                }}/>
                <Drawer.Screen name="Account" component={Account}
                               options={{drawerIcon: () => (<Icon name='account-circle' type='material'/>)}}/>
                <Drawer.Screen name="Settings" component={Settings}
                               options={{drawerIcon: () => (<Icon name='settings'/>)}}/>
                <Drawer.Screen name="Log out" component={Settings}
                               options={{drawerIcon: () => (<Icon name='logout-variant' type={"material-community"}/>)}}
                               listeners={props => {
                                   logOut();
                               }}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    menu: {
        marginStart: 10,
        marginEnd: 10
    },
});
