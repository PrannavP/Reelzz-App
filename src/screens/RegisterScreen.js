import React, { useState } from 'react';
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
    Alert,
    Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { registerUser } from '../services/auth';

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            // console.log("register button");

            // console.log(username, email, password, profileImage);

            const data = new FormData();
            data.append('username', username);
            data.append('email', email);
            data.append('password', password);
            // console.log(profileImage.uri);
            if (profileImage) {
                data.append('profileImage', {
                    uri: profileImage.uri,
                    type: 'image/jpeg',
                    name: 'profile.jpg'
                });
            }

            const response = await registerUser(data);

            // console.log('Registration Successful: ', response);
            
            Alert.alert("Success", "Registration success");
            // Navigate to Home screen after successful registration
            navigation.replace('Login');
        } catch (err) {
            setError("Something went wrong!");
            console.log(err);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0]);
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
                        <Image
                            source={require("../../assets/Reelzz-Icon.png")}
                            style={styles.logo}
                        />

                        <Text style={styles.title}>Create an account</Text>

                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            {profileImage ? (
                                <Image source={{ uri: profileImage.uri }} style={styles.profileImage} />
                            ) : (
                                <Text style={styles.imagePickerText}>Pick a profile image</Text>
                            )}
                        </TouchableOpacity>

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
                                placeholder="Email"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
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
                            onPress={handleRegister}
                        >
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.loginLink}>Login</Text>
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
    loginContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    loginText: {
        color: '#333',
    },
    loginLink: {
        color: '#1e90ff',
        fontWeight: 'bold',
    },
    logo: {
        width: 400,
        height: 150,
        marginBottom: 10,
    },
    imagePicker: {
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        padding: 15,
        marginBottom: 20,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#333',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});

export default RegisterScreen;