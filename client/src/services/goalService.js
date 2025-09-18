import axios from 'axios';

const API_URL = 'http://localhost:5000/api/goals';

const getGoals = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching goals:', error);
        throw error;
    }
};

const createGoal = async (goalData) => {
    try {
        const response = await axios.post(API_URL, goalData);
        return response.data;
    } catch (error) {
        console.error('Error creating goal:', error);
        throw error;
    }
};

export{ getGoals, createGoal};