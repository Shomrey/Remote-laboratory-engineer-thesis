import {Header as RNElementsHeader, Icon} from "react-native-elements";
import {DrawerActions} from "@react-navigation/native";
import React from "react";
import {StyleSheet} from "react-native";

export default function DrawerHeader(props) {
    return (
        <RNElementsHeader
            leftComponent={
                <Icon name="menu" size={40} onPress={() => {
                    props.navigation.dispatch(DrawerActions.toggleDrawer())
                }}/>
            }
            backgroundColor="#cfd8dc"
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
    }
});