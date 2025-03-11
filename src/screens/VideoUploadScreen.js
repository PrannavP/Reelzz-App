import { useState, useContext } from 'react';
import { View, Button, Alert, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { uploadVideo } from '../services/videoUpload';

import { UserContext } from '../context/UserContext';

const VideoUploadScreen = () => {
    const { user } = useContext(UserContext);

    const navigation = useNavigation();

    const [videoUri, setVideoUri] = useState(null);

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            setVideoUri(result.assets[0].uri);
        }
    };

    const uploadVideoFnc = async () => {
        if (!videoUri) {
            Alert.alert('Please select a video first');
            return;
        }

        try {
            const response = await uploadVideo(videoUri, user.user.username);
            Alert.alert('Video uploaded successfully', response.message);
            navigation.navigate("Home");

        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to upload video');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upload a Video</Text>

            {videoUri && (
                <View style={styles.videoPreviewContainer}>
                    <Text style={styles.videoText}>Selected Video:</Text>
                    <Image source={{ uri: videoUri }} style={styles.videoPreview} />
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={pickVideo}>
                <Text style={styles.buttonText}>Pick a Video</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, !videoUri && styles.disabledButton]}
                onPress={uploadVideoFnc}
                disabled={!videoUri}
            >
                <Text style={styles.buttonText}>Upload Video</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    videoPreviewContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    videoText: {
        fontSize: 16,
        marginBottom: 10,
        color: '#333',
    },
    videoPreview: {
        width: 300,
        height: 200,
        borderRadius: 8,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 5,
        marginVertical: 10,
    },
    disabledButton: {
        backgroundColor: '#a1a1a1',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default VideoUploadScreen;