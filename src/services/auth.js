import axios from "axios";

const API_BASE_URL = "http://192.168.1.2:5000";

// function to register
export const registerUser = async(formdata) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formdata, {
            headers:{
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }catch(err){
        console.log("Register error: ", err);
        throw err;
    }
};

// function to login
export const loginUser = async(username, password) => {
    try{
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            username: username,
            password: password
        });
        return response.data;
    }catch(err){
        console.log("Login error: ", err);
        throw err;
    }
};