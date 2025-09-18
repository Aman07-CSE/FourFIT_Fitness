import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Import GoogleGenerativeAI
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Google Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Function to get response from Google Gemini AI
async function getGeminiResponse(prompt) {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
}


// Route to handle chatbot requests
app.post('/api/chatbot', async (req, res) => {
    console.log(req.body);
    const { name, gender, age, height, weight, question } = req.body;

    // Construct a clear and structured prompt for the AI
    const prompt = `
        You are an intelligent fitness assistant.
        User Information:
        - Name: ${name}
        - Gender: ${gender}
        - Age: ${age}
        - Height: ${height} cm
        - Weight: ${weight} kg
        User Question: ${question}
        
        Please provide a detailed response, including tips or suggestions related to the user's question.
    `;

    try {
        // Get AI response
        const aiResponse = await getGeminiResponse(prompt);
        
        // Format the AI response for clarity and structure
        const formattedResponse = formatResponse(aiResponse);

        // Send the formatted AI response to the client
        res.status(200).json({ response: formattedResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ response: 'There was back an error processing your request.' });
    }
});
app.post('/api/dietPlanner', async (req, res) => {
    const { name, age, gender, height, weight,targetWeight, goal, dietType, mealTime, question } = req.body;

    // Construct a clear and structured prompt for the AI
    const prompt = `
        You are a professional nutrition and fitness expert, assisting users in achieving their health and dietary goals. 
        Using the provided user information, craft a personalized and actionable dietary plan, including meal suggestions, tips, and general advice tailored to their specific needs.
        User Information:
        - Name: ${name}
        - Age: ${age}
        - Gender: ${gender}
        - Height: ${height} cm
        - Weight: ${weight} kg
        - Target Weight: ${targetWeight} kg
        - Goal (e.g., weight loss, muscle gain,maintenance, Improved Energy): ${goal}
        - Diet Type (e.g., vegetarian, vegan,non-vegetarian,keto): ${dietType}
        - Preferred Meal Time(s): ${mealTime} meals per day
        - User Note/Specific Allergy: "${question}" (e.g., gluten intolerance, nut allergy)
        
        Response Requirements:
        1. Summary:
            - Provide an overview of the user's current stats, goals, and dietary preferences.
            - Mention how their diet can help them achieve their target weight and goal.

        2. Personalized Meal Plan:
            - Suggest specific examples for each meal of the day (breakfast, lunch, dinner, and snacks) based on their preferences and goal.
            - Include portion sizes, if possible, for better clarity.
            - Mention any suitable alternatives or substitutions for common allergens.

        3. Additional Tips:
            - Include tips for hydration, meal timing, and exercise routines that complement the diet plan.
            - Suggest lifestyle habits for improved results (e.g., mindfulness eating, adequate sleep).

        4. Tone:
            - Maintain a positive, motivating, and professional tone.
            - Avoid overly technical jargon; keep the advice simple and actionable.


        Example Output Format:
        - Summary: A concise overview of the user's profile and their health goals.
        - Meal Plan:
            - Breakfast: Example food items.
            - Lunch: Example food items.
            - Dinner: Example food items.
            - Snacks: Example food items.
        - Tips: Personalized suggestions for achieving their goal efficiently.

        Use the provided information to craft the most suitable plan for the user.Ensure that the response is clear, actionable, and easy to understand.

        Start the responce with "I am your 4fit AI assistant and I am here to help you with your diet plan".
        End the response with "I hope this helps you in your fitness journey!"
        include double line breaks when single line breaks are used in the response        
    `;

    try {
        // Get AI response
        const aiResponse = await getGeminiResponse(prompt);
        
        // Format the AI response for clarity and structure
        const formattedResponse = formatResponse(aiResponse);

        // Send the formatted AI response to the client
        res.status(200).json({ response: formattedResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ response: 'There was an error processing your request.' });
    }
});
app.post('/api/exercise', async (req, res) => {
    const { name, time, difficulty, focus, training, equipment, question, age, gender, height, weight } = req.body;

    // Construct a clear and structured prompt for the AI
    const prompt = `
        You are an intelligent fitness assistant who guides me to acheive the goals and ensure my workout plans are accurate.
        User Information:
        - Name: ${name}
        - Age: ${age}
        - gender: ${gender}
        - Height: ${height} cm
        - weight: ${weight}
        - Time: ${time} minutes
        - Difficulty: ${difficulty}
        - Focus: ${focus}
        - Training: ${training}
        - Equipment: ${equipment}
        User Question: ${question}
        

        Please provide a detailed response, including tips or suggestions related to the user's data.
        Start the response with "I am your 4fit AI assistant and I will guide you to acheive your goals".
        include double line breaks when single line breaks are used in the response.
    `;

    try {
        // Get AI response
        const aiResponse = await getGeminiResponse(prompt);
        
        // Format the AI response for clarity and structure
        const formattedResponse = formatResponse(aiResponse);

        // Send the formatted AI response to the client
        res.status(200).json({ response: formattedResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ response: 'There was an error processing your request.' });
    }
});

// Function to format the AI response
function formatResponse(response) {
    // Split the response into lines
    const lines = response.split('\n').filter(line => line.trim() !== '');

    // Initialize an array to hold formatted output
    let formattedOutput = [];
    let inList = false; // Track if we are currently adding to a list

    // Loop through each line to format it
    lines.forEach(line => {
        line = line.trim(); // Clean up whitespace

        // Remove Markdown formatting
        line = line.replace(/^\#\s+/g, ''); // Remove leading hashtags for headings
        line = line.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove bold asterisks
        line = line.replace(/^\*\s+/g, ''); // Remove leading asterisks for list items

        // Check if the line starts with "Healthy Vegetarian Breakfast Options for"
        if (line.startsWith('Healthy Vegetarian Breakfast Options for')) {
            formattedOutput.push(`<h2>${line}</h2>`); // Treat this line as a heading
        } 
        // Check for tips section or similar headings
        else if (line.startsWith('Tips for a Healthy Breakfast:')) {
            formattedOutput.push(`<h3>${line}</h3>`); // Treat as a subheading
        }
        if(line.startsWith('Provide me the video link of')){
            formattedOutput.push(`<h2>${line}</h2>`);
        }
        // Check for bullet points (lines starting with *)
        else if (line.startsWith('•')) {
            if (!inList) {
                formattedOutput.push('<ul>'); // Start a new list
                inList = true; // Update the tracking variable
            }
            // Add list item without the asterisk
            formattedOutput.push(`<li>${line.slice(2).trim()}</li>`);
        } 
        // Check if the line is part of a list but doesn't start with an asterisk
        else if (inList && line === '') {
            // If there's an empty line, close the list
            formattedOutput.push('</ul>');
            inList = false; // Reset the tracking variable
        } 
        // Otherwise treat it as a paragraph
        else {
            formattedOutput.push(`<p>${line}</p>`);
        }
    });

    // Close any open list at the end of processing
    if (inList) {
        formattedOutput.push('</ul>'); // Close the list if still open
    }

    return formattedOutput.join('');
}

// Start server
app.listen(PORT, () => {
    console.log(`Chatbot backend server running on http://localhost:${PORT}`);
});
