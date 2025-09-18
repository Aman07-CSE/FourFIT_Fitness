import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaderboard';

const getLeaderboardEntries = async () => {
    try{
        const response = await axios.get(API_URL);
        return response.data;
    } catch(error){
        console.error('Error fetching leaderboard entries:' , error);
        throw error;
    }
    
};

const createLeaderboardEntry = async (leaderboardData) => {
    try{
        const response = await axios.post(API_URL, leaderboardData);
        return response.data; 
    } catch(error){
        console.error('Error creating leaderboard entry:' , error);
        throw error;
    }
    
};

export{getLeaderboardEntries, createLeaderboardEntry};