import 'react-native-gesture-handler';
import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Home from './Home';
import Settings from './Settings';
import {Icon} from "react-native-elements";
import Account from "./Account";
import Enroll from "./Enroll";
import Results from "./Results";
import DrawerContentScrollView from "@react-navigation/drawer/src/views/DrawerContentScrollView";
import DrawerItemList from "@react-navigation/drawer/src/views/DrawerItemList";

const Drawer = createDrawerNavigator();

export default function Main({logOut}) {

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <DrawerContent {...props}/>}>
                <Drawer.Screen name="Home" component={Home} options={{
                    drawerIcon: () => (<Icon name='home'/>),
                    unmountOnBlur: true
                }}/>
                <Drawer.Screen name="Enroll" component={Enroll} options={{
                    drawerIcon: () => (<Icon name='assignment'/>),
                    unmountOnBlur: true
                }}/>
                <Drawer.Screen name="Results" component={Results} options={{
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
                                   setTimeout(logOut, 300);
                               }}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

function DrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={
                        require('../../assets/logo_agh.png')
                    }
                />
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    menu: {
        marginStart: 10,
        marginEnd: 10
    },
    logoContainer: {
        margin: 30,
        marginTop: 50,
        marginLeft: 60,
        height: 150,
        width: 150,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10.84,
        elevation: 15,
        borderRadius: 25,
    },
    logo: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'contain',
        borderRadius: 25
    },
});
