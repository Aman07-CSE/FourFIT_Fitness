const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, required: true },
    birth: { type: Date, required: true},
    workouts: [
        {
            exerciseName: { type: String, required: true },
            sets: { type: Number, required: true },
            reps: { type: Number, required: true },
            date: { type: Date, required: true },
            intensity: { type: String, required: true },  // Low, Medium, High
            duration: { type: Number, required: true },  // Duration in minutes
            calories: { type: Number, required: true }   // Calories burned for the workout
        }
    ],
    bmiEntries: [
        {
            weight: { type: Number, required: true },
            height: { type: Number, required: true },
            bmi: { type: Number, required: true },
            //classification: { type: String, required: true },
            date: { type: Date, required: true }
        }
    ],
    bodyEntries: [
        {
            waist: { type: Number, required: true },
            neck: { type: Number, required: true },
            hip: { type: Number, required: false },
            weight: { type: Number, required: true },
            height: { type: Number, required: true },
            bodyFat: { type: Number, required: true },
            muscleMass: { type: Number, required: true },
            bodyscore: { type: Number, required: true },
            date: { type: Date, required: true },
        }
    ],
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
