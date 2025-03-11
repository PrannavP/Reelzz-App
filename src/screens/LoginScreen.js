import React, { useContext, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';
import { loginUser } from '../services/auth';

const LoginScreen = ({ navigation }) => {
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try{
            const data = await loginUser(username, password);
            Alert.alert("Success", "login success");

            // console.log(data.token);
            // console.log(data.user.id);
            // console.log(data.user.email);

            // save user context
            setUser(data);

            // store in async/storage
            try{
                await AsyncStorage.setItem("token", data.token);
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                console.log("Login successful, token stored");
            }catch(err){
                console.log("Error storing async storage");
            }

            // Navigate to Home screen after successful login
            navigation.replace('HomeTabs');
        }catch(err){
            setError("something went wrong!");
            console.log(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.title}>Login</Text>
                        
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                            />
                            
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                        
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                        
                        <View style={styles.registerContainer}>
                            <Text style={styles.registerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.registerLink}>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        padding: 15,
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: '#333',
    },
    registerLink: {
        color: '#1e90ff',
        fontWeight: 'bold',
    },
});

export default LoginScreen;