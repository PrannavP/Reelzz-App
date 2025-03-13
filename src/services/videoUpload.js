import axios from "axios";

// API Base URL
const API_BASE_URL = "http://192.168.1.2:5000";

// function to upload video
export const uploadVideo = async (videoUri, uploadedBy) => {
    const fileName = videoUri.split('/').pop();

    // create form data
    const formData = new FormData();
    formData.append('video', {
        uri: videoUri,
        name: fileName,
        type: 'video/mp4'
    });
    formData.append("uploadedBy", uploadedBy);

    try{
        const response = await axios.post(`${API_BASE_URL}/api/videos/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }catch(err){
        throw err;
    }
};

// function to get all videos
export const getAllVideos = async () => {
    try{
        const response = await axios.get(`${API_BASE_URL}/api/videos`);
        return response.data;
    }catch(err){
        console.error("Error while fetching videos: ", err);
        throw err;
    }
};

// function to update likes of videos
export const likeVideo = async (videoId, userId) => {
    try{
        const response = await axios.put(`${API_BASE_URL}/api/videos/like/${videoId}`, {
            userId: userId
        });
        return response;
    }catch(err){
        console.error("Error while liking the video", err);
        throw err;
    }
};