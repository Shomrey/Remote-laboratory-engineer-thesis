import 'react-native-gesture-handler';
import React, {useContext, useRef, useState} from 'react';
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import socketIOClient from "socket.io-client";
import {AuthContext} from "../context/AuthContext";

const Tab = createMaterialTopTabNavigator();

export default function LabClass(props) {
    const lab = props.route.params.lab;

    props.navigation.setOptions({
        headerRight: () => <Icon name={'save'} type={"ionicon"} size={30} style={{marginRight: 10}} onPress={() => {
            Alert.alert(
                'Save configuration',
                'Do you want to save and send your configuration?',
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: () => console.log("OK Pressed")
                    }
                ],
            );
        }}/>,
        headerStyle: {
            borderRadius: 5,
            shadowColor: "#000000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3,
            backgroundColor: '#cfd8dc',
        },
        headerBackTitle: "Home"
    });

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
            <Text style={styles.text}>{tasks ? tasks.replace(/#/gi, '\n') : ''}</Text>
        </View>
    )
}

function LabTerminal() {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [terminalContent, setTerminalContent] = useState('');
    const [command, setCommand] = useState('');
    const [token] = useContext(AuthContext);
    const [socket, setSocket] = useState();
    const scrollView = useRef(null);

    const initializeSocketIO = () => {
        const socket = socketIOClient("https://remote-laboratory.herokuapp.com");

        socket.emit('access_token', {tok: token, raspberry_id: 'malina_1'});
        socket.on('output', (data) => {
            setTerminalContent(data);
        });

        setSocket(socket);
        setSessionStarted(true);
    }

    return (
        <View style={styles.tabContainer}>
            <ScrollView style={styles.terminalWindow} ref={scrollView}
                        onContentSizeChange={() => scrollView.current.scrollToEnd({animated: true})}>
                {sessionStarted ?
                    (
                        <Text style={styles.terminalText}>
                            {terminalContent}
                        </Text>)
                    :
                    (
                        <View style={styles.button}>
                            <Button title={'Start session'} onPress={initializeSocketIO}/>
                        </View>
                    )
                }
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={140}>
                <View style={styles.inputContainer}>
                    <View style={styles.input}>
                        <Text style={styles.textInput}>$ </Text>
                        <TextInput style={styles.textInput} placeholder="Write your commands here" onChangeText={
                            (text => setCommand(text))
                        } autoCapitalize={"none"} autoCompleteType={"off"} autoCorrect={false}
                                   editable={socket !== undefined}/>
                    </View>
                    <Icon name="play-arrow" size={60} onPress={() => {
                        if (socket && socket.connected) {
                            socket.emit('command', command);
                        } else {
                            setTerminalContent('Failed to connect to the server');
                        }
                    }}/>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    tabContainer: {
        padding: 13,
        flex: 1,
        marginBottom: 2
    },
    text: {
        fontSize: 20
    },
    terminalWindow: {
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        flex: 1,
        backgroundColor: 'black',
    },
    input: {
        borderColor: 'black',
        backgroundColor: 'black',
        color: 'white',
        borderWidth: 1,
        width: '80%',
        alignItems: 'center',
        paddingLeft: 10,
        flexDirection: 'row',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#dfe1e6',
        height: 100,
        width: 100,
        borderRadius: 100,
        alignSelf: 'center',
        marginTop: 200,
        elevation: 15,
        color: 'red'
    },
    inputContainer: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: "space-between"
    },
    textInput: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'SourceCodePro_500Medium'
    },
    terminalText: {
        fontSize: 16,
        color: 'lightgray',
        fontFamily: 'SourceCodePro_500Medium'
    }
});

