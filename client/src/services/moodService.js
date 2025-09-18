import axios from 'axios';

const API_URL = 'http://localhost:5000/api/moods';

const getMoods = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching moods:', error);
        throw error;
    }
};

const createMood = async (moodData) => {
    try {
        const response = await axios.post(API_URL, moodData);
        return response.data;
    } catch (error) {
        console.error('Error creating mood:', error);
        throw error;
    }
};

export{ getMoods, createMood};