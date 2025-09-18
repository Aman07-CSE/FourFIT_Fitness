// controllers/goalsController.js

const Goal = require('../models/Goal'); // Assuming the Goal model is defined elsewhere

// Save new goal
exports.setGoal = async (req, res) => {
  try {
    const { userId, exercise, targetTime, reminderTime } = req.body;

    // Validation: Ensure all necessary fields are provided
    if (!userId || !exercise || !targetTime) {
      return res.status(400).json({ message: 'Missing required fields: userId, exercise, and targetTime.' });
    }

    // Create a new Goal
    const goal = new Goal({
      userId,
      exercise,
      targetTime,
      reminderTime: reminderTime || null, // reminderTime is optional
    });

    // Save the goal to the database
    await goal.save();
    res.status(201).json({ message: 'Goal saved successfully', goal });
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(500).json({ message: 'Error setting goal', error: error.message });
  }
};

// Get goals by user
exports.getUserGoals = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validation: Ensure userId is provided in params
    if (!userId) {
      return res.status(400).json({ message: 'userId is required in the request parameters.' });
    }

    // Fetch goals from the database for the given userId
    const goals = await Goal.find({ userId });
    
    if (!goals.length) {
      return res.status(404).json({ message: 'No goals found for this user.' });
    }

    res.status(200).json({ goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Error fetching goals', error: error.message });
  }
};
