import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from 'react-native-vector-icons';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllVideos, likeVideo } from '../services/videoUpload';
import { UserContext } from '../context/UserContext';
import { RefreshControl } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const HomeScreen = () => {
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const videoRefs = useRef({});
    const [currentVisibleVideo, setCurrentVisibleVideo] = useState(null);
    const [likedVideos, setLikedVideos] = useState({});

    // Fetch videos on mount
    useEffect(() => {
        const fetchLikedVideos = async () => {
            const likedVideosString = await AsyncStorage.getItem('likedVideos');
            if (likedVideosString) {
                setLikedVideos(JSON.parse(likedVideosString));
            }
        };

        fetchVideos();
        fetchLikedVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await getAllVideos();
            setVideos(response);
            // Set initial liked videos state
            const likedVideosState = {};
            response.forEach(video => {
                likedVideosState[video._id] = video.likedBy.includes(user.user._id);
            });
            setLikedVideos(likedVideosState);
        } catch (error) {
            console.error("Error fetching videos", error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        const newVideos = await getAllVideos();
        setVideos(newVideos);
        setRefreshing(false);
    };

    // Detects the most visible video
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            const mostVisible = viewableItems[0].item._id;
            setCurrentVisibleVideo(mostVisible);
        }
    }, []);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50, // Video must be 50% visible to play
    };

    useEffect(() => {
        Object.keys(videoRefs.current).forEach((id) => {
            if (videoRefs.current[id]) {
                if (id === currentVisibleVideo) {
                    videoRefs.current[id].playAsync();
                } else {
                    videoRefs.current[id].pauseAsync();
                }
            }
        });
    }, [currentVisibleVideo]);

    // Stop all videos when navigating away
    useFocusEffect(
        useCallback(() => {
            return () => {
                Object.keys(videoRefs.current).forEach((id) => {
                    if (videoRefs.current[id]) {
                        videoRefs.current[id].pauseAsync();
                    }
                });
            };
        }, [])
    );

    const handleLike = async (item) => {
        try {
            const response = await likeVideo(item._id, user.user._id);
            const updatedVideo = response.data.video;

            setLikedVideos((prevLikedVideos) => {
                const updatedLikedVideos = {
                    ...prevLikedVideos,
                    [item._id]: !prevLikedVideos[item._id],
                };
                AsyncStorage.setItem('likedVideos', JSON.stringify(updatedLikedVideos));
                return updatedLikedVideos;
            });

            // Update the video list with the updated like count
            setVideos((prevVideos) =>
                prevVideos.map((video) =>
                    video._id === updatedVideo._id ? updatedVideo : video
                )
            );
        } catch (error) {
            console.error('Error liking video:', error);
        }
    };

    const renderItem = ({ item }) => {
        const videoUrl = `http://192.168.1.8:5000/uploads/videos/${item.fileName}`;

        return (
            <View style={styles.videoCard}>
                <View style={styles.videoContainer}>
                    <Video
                        ref={(ref) => (videoRefs.current[item._id] = ref)}
                        source={{ uri: videoUrl }}
                        style={styles.videoPlayer}
                        resizeMode='cover'
                        shouldPlay={false}
                        useNativeControls={false}
                        isLooping
                        onError={(e) => console.log("Video error", e)}
                    />
                </View>
                <View style={styles.videoInfo}>
                    <Text><Text style={styles.title}>{item.uploadedBy}</Text> Posted</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => handleLike(item)}>
                            <Ionicons
                                name={likedVideos[item._id] ? "heart" : "heart-outline"}
                                size={24}
                                color="red"
                            />
                        </TouchableOpacity>
                        <Text style={styles.likeCount}>{item.likesCount}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={videos}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 10,
    },
    videoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    videoContainer: {
        width: width - 20,
        height: height * 0.6,
        backgroundColor: '#000',
        borderRadius: 10,
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    videoInfo: {
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    likeCount: {
        marginLeft: 8,
        fontSize: 16,
    },
});

export default HomeScreen;