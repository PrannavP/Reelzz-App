import axios from "axios";

// API Base URL
const API_BASE_URL = "http://192.168.1.2:5000";

// function to save likes in db
export const saveVideLikes = async (userID, videoID) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/api/likes/save-like`, {
            userId: userID,
            videoId: videoID
        });
        console.log("Save like api response: ", response.data);
        return response.data;
    }catch(err){
        console.error("Error while saving like: ", err);
        throw err;
    }
};