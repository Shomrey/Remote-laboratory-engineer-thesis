import {Header as RNElementsHeader, Icon} from "react-native-elements";
import {DrawerActions} from "@react-navigation/native";
import React from "react";
import {StyleSheet} from "react-native";
import HeaderTitle from "@react-navigation/stack/src/views/Header/HeaderTitle";

export default function DrawerHeader(props) {
    return (
        <RNElementsHeader
            leftComponent={
                <Icon name="menu" size={40} onPress={() => {
                    props.navigation.dispatch(DrawerActions.toggleDrawer())
                }}/>
            }
            centerComponent={() => <HeaderTitle>{props.title}</HeaderTitle>}
            containerStyle={styles.header}
        />
    )
}

const styles = StyleSheet.create({
    header: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 7,
        zIndex: 1,
        elevation: 10,
        backgroundColor: "#cfd8dc",
        shadowColor: 'black',
    }
});