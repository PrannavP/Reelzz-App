import React, { useContext } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../context/UserContext';

const ProfileScreen = () => {
    const { user } = useContext(UserContext);

    const navigation = useNavigation();

    const handleLogout = async () => {
        try{
            // Here you would add your logout logic
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            console.log('User logged out');

            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }catch(err){
            console.log("Error while logging out", err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Image
                                source={{ uri: user.user.userImage }}
                                style={styles.avatar}
                            />
                        </View>
                    </View>
                    <Text style={styles.userName}>{user.user.username}</Text>
                    <Text style={styles.userInfo}>{user.user.email}</Text>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Account Information</Text>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Username</Text>
                        <Text style={styles.infoValue}>{user.user.username}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue}>{user.user.email}</Text>
                    </View>
                </View>

                <View style={styles.actionsSection}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Change Password</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.logoutButton]}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingTop: 15,
        paddingBottom: 30,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    userInfo: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    infoSection: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    actionsSection: {
        padding: 20,
    },
    actionButton: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#333',
        fontWeight: '500',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff6b6b',
        marginTop: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ProfileScreen;