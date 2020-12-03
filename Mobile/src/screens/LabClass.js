import 'react-native-gesture-handler';
import React, {useContext, useEffect, useRef, useState} from 'react';
// noinspection JSDeprecatedSymbols
import {
    Alert,
    Button,
    KeyboardAvoidingView,
    Picker,
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
import Axios from "axios";
import {HeaderBackButton} from "@react-navigation/stack";

const Tab = createMaterialTopTabNavigator();

export default function LabClass(props) {
    const lab = props.route.params.lab;
    const [result, setResult] = useState([]);
    const [token, setToken] = useContext(AuthContext);
    const [sendResultFunction, setSendResultFunction] = useState(null);
    const [socket, setSocket] = useState(null);

    props.navigation.setOptions({
        headerRight: () =>
            <View style={styles.headerRight}>
                <Icon name={'save'} type={"ionicon"} size={30} style={{marginRight: 10}} color={sendResultFunction ? 'black' : 'gray'} onPress={() => {
                    if (sendResultFunction) {
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
                                    onPress: () => sendResultFunction()
                                }
                            ],
                        );
                    }
                }}/>
            </View>,
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
        headerBackTitle: "Home",
        headerLeft: (props) => (
            <HeaderBackButton
                {...props}
                onPress={() => {
                    if (socket) {
                        socket.disconnect();
                    }
                    props.onPress()
                }}
            />
        )
    });

    return (
        <Tab.Navigator>
            <Tab.Screen name={Platform.OS === 'ios' ? "Intro" : "Introduction"} component={LabIntroduction}
                        initialParams={{description: lab.description, topology: lab.topology}}/>
            <Tab.Screen name="Tasks" component={LabTasks} initialParams={{tasks: lab.tasks}}/>
            <Tab.Screen name="Terminal" component={LabTerminal} initialParams={{
                setResult: setResult,
                configuration: lab.configuration, collectResultsCommands: lab.collectResultsCommands,
                setSendResultFunction, labId: lab.id, setSocket
            }}/>
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

function LabTerminal(props) {
    const [sessionStarted, setSessionStarted] = useState(false);
    const [terminalContent, setTerminalContent] = useState('');
    const [command, setCommand] = useState('');
    const [token] = useContext(AuthContext);
    const [socket, setSocket] = useState();
    const [availableRaspberries, setAvailableRaspberries] = useState([]);
    const [selectedRaspberry, setSelectedRaspberry] = useState('');
    const scrollView = useRef(null);
    const [result, setResult] = useState('');

    const setSendResultFunction = props.route.params.setSendResultFunction;
    const configuration = props.route.params.configuration;
    const collectResultsCommands = props.route.params.collectResultsCommands;
    const labId = props.route.params.labId;
    const setSocket2 = props.route.params.setSocket;

    useEffect(() => {
        const socket = socketIOClient("https://remote-laboratory.herokuapp.com");
        setSocket(socket);
        setSocket2(socket);
        socket.emit('available_raspberries');
        socket.on('available_raspberries', (data) => {
            setAvailableRaspberries(data);
            if (data.length > 0) {
                setSelectedRaspberry(data[0]);
            }
        })

    }, []);

    const askForInitialConfig = (socket) => {
        Alert.alert(
            'Load initial configuration',
            'Do you want to download and apply initial configuration?',
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: () => {
                        const commands = configuration.split(',');
                        commands.forEach(command => {
                            setTerminalContent(terminalContent => terminalContent + '> ' + command + '\n');
                            socket.emit('command', command);
                        });
                    }
                }
            ],
        );
    }

    const sendResultFunction = (socket) => {
        setResult('');
        const commands = collectResultsCommands.split(',');
        setTimeout(() => {
            setResult(result => {
                Axios.patch(
                    `https://remote-laboratory.herokuapp.com/api/users/current/labs/${labId}/result`,
                    {result}, {headers: {'Authorization': `Bearer ${token}`}})

                return result;
            });
        }, 3000);
        commands.forEach(command => {
            setTerminalContent(terminalContent => terminalContent + '> ' + command + '\n');
            socket.emit('command', command);
        });
    }

    const authenticateSocket = () => {
        socket.emit('access_token', {tok: token, raspberry_id: selectedRaspberry});
        askForInitialConfig(socket);
        setSendResultFunction(() => () => sendResultFunction(socket));
        socket.on('output', (data) => {
            setTerminalContent(terminalContent => terminalContent + data + '\n');
            setResult(result => result + data + '\n');
        });
        socket.on('re_auth', () => socket.emit('access_token', {tok: token, raspberry_id: selectedRaspberry}));

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
                        availableRaspberries.length > 0 ? (
                            <View>
                                <Picker style={{backgroundColor: '#dfe1e6', flex: 1}}
                                        selectedValue={selectedRaspberry}
                                        onValueChange={(itemValue) => setSelectedRaspberry(itemValue)}>
                                    {availableRaspberries.map(raspberry => <Picker.Item label={raspberry}
                                                                                        value={raspberry}
                                                                                        key={raspberry}/>)}
                                </Picker>
                                <View style={styles.button}>
                                    <Button title={'Start session'} onPress={authenticateSocket}/>
                                </View>
                            </View>
                        ) : (
                            <Text style={{...styles.text, color: 'red', alignSelf: 'center'}}>No raspberries
                                available</Text>
                        )
                    )
                }
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={140}>
                <View style={styles.inputPlaceholder}>
                    {sessionStarted ? (
                        <View style={styles.inputContainer}>
                            <View style={styles.input}>
                                <Text style={styles.textInput}>$ </Text>
                                <TextInput style={styles.textInput} placeholder="Write your commands here"
                                           onChangeText={
                                               (text => setCommand(text))
                                           } autoCapitalize={"none"} autoCompleteType={"off"} autoCorrect={false}
                                           editable={sessionStarted}/>
                            </View>
                            <Icon name="play-arrow" size={60} onPress={() => {
                                if (sessionStarted) {
                                    socket.emit('command', command);
                                    setTerminalContent(terminalContent => terminalContent + '> ' + command + '\n');
                                } else if (!socket.connected) {
                                    setTerminalContent('Failed to connect to the server');
                                }
                            }}/>
                        </View>
                    ) : null}
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
        marginTop: 100,
        elevation: 15,
        color: 'red'
    },
    inputPlaceholder: {
        marginTop: 25
    },
    inputContainer: {
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
    },
    headerRight: {
        flexDirection: 'row'
    }
});

