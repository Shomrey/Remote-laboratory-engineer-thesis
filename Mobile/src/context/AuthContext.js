import 'react-native-gesture-handler';
import React, { useState, createContext } from 'react';

const AuthContext = createContext();

function AuthProvider(props) {
    const [token, setToken] = useState('');

    return (
        <AuthContext.Provider value={[token, setToken]}>
            {props.children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };