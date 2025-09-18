import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts';

const getWorkouts = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        throw error;
    }
};

const createWorkout = async (workoutData) => {
    try {
        const response = await axios.post(API_URL, workoutData);
        return response.data;
    } catch (error) {
        console.error('Error creating workout:', error);
        throw error;
    }
};

export { getWorkouts, createWorkout};