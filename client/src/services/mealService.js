import axios from 'axios';

const API_URL = 'http://localhost:5000/api/meals';

const getMeals = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw error;
    }
};

const createMeal = async (mealData) => {
    try {
        const response = await axios.post(API_URL, mealData);
        return response.data;
    } catch (error) {
        console.error('Error creating meal:', error);
        throw error;
    }
};

export { getMeals, createMeal};