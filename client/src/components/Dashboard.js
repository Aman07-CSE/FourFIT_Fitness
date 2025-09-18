import '../styles/Dashboard.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const intensityMultiplierMap = { Low: 1, Medium: 1.5, High: 2 };

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalCalories: 0,
    totalWorkouts: 0,
    avgCaloriesPerWorkout: 0,
  });

  // form states
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [date, setDate] = useState('');
  const [weight, setWeight] = useState('');
  const [intensity, setIntensity] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // allow only positive numbers or blank
  const handlePositiveChange = setter => e => {
    const value = e.target.value;
    if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
      setter(value);
    }
  };

  // exercise options (shortened for brevity—add all you need)
  const exerciseOptions = [
    { name: 'Running', calories: 10 },
    { name: 'Cycling', calories: 8 },
    { name: 'Swimming', calories: 12 },
    { name: 'Strength Training', calories: 6 },
    { name: 'HIIT', calories: 15 },
    // ... add the rest of your exercises
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // fetch user + workouts
    axios
      .get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setUser(res.data.user);
        setWorkouts(res.data.user.workouts);

        // fetch dashboard stats
        return axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(statRes => {
        setDashboardData(
          statRes.data || {
            totalCalories: 0,
            totalWorkouts: 0,
            avgCaloriesPerWorkout: 0,
          }
        );

        const userData = statRes.data?.user || {};
        if (userData.bmiEntries?.length) {
          const sorted = userData.bmiEntries.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          const lastEntry = sorted[0];
          if (lastEntry.weight) setWeight(lastEntry.weight.toString());
        }
      })
      .catch(err => console.error('Error loading dashboard data:', err));
  }, []);

  // age calculator (if needed later)
  const calculateAge = dobString => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  };

  // recalc calories when inputs change
  useEffect(() => {
    const selectedExercise = exerciseOptions.find(o => o.name === exerciseName);
    const setsNum = Number(sets);
    const repsNum = Number(reps);
    const durationNum = Number(duration);

    if (selectedExercise && intensity && !isNaN(durationNum)) {
      const intensityMultiplier = intensityMultiplierMap[intensity] || 1;
      const volumeMultiplier =
        !isNaN(setsNum) && !isNaN(repsNum) ? (setsNum * repsNum) / 30 : 1;

      const calculatedCalories =
        selectedExercise.calories *
        durationNum *
        intensityMultiplier *
        volumeMultiplier;

      setCalories(Math.round(calculatedCalories));
    } else {
      setCalories(0);
    }
  }, [exerciseName, intensity, duration, sets, reps]);

  const handleAddWorkout = () => {
    const token = localStorage.getItem('token');
    const workoutData = {
      exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight) || 0,
      date,
      intensity,
      duration: Number(duration),
      calories,
    };

    axios
      .post('http://localhost:5000/api/add-workout', workoutData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setWorkouts(prev => [...prev, workoutData]);
        return axios.get('http://localhost:5000/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(statRes => {
        setDashboardData(
          statRes.data || {
            totalCalories: 0,
            totalWorkouts: 0,
            avgCaloriesPerWorkout: 0,
          }
        );
        // reset form
        setExerciseName('');
        setSets('');
        setReps('');
        setWeight('');
        setDate('');
        setIntensity('');
        setDuration('');
        setCalories(0);
        setShowModal(false);
      })
      .catch(err => console.error('Error adding workout:', err));
  };

  const handleExerciseChange = e => {
    setExerciseName(e.target.value);
  };

  const calorieData = workouts.map(w => ({
    date: new Date(w.date).toLocaleDateString(),
    calories: w.calories,
  }));

  return (
    <div className="dashboard-main-container">
      {user ? (
        <>
          <div className="dashboard-output-section">
            <h1 className="dashboard-h1">Hi, {user.name}</h1>
            <h1 className="dashboard-h1">
              <span>Your Workout History</span>
            </h1>

            <div className="dashboard-cards">
              <div className="dashboard-card">
                <h2>Calories Burned Today</h2>
                <p>{dashboardData.totalCalories || 0} kcal</p>
              </div>
              <div className="dashboard-card">
                <h2>Total Workouts Today</h2>
                <p>{dashboardData.totalWorkouts || 0}</p>
              </div>
              <div className="dashboard-card">
                <h2>Average Calories / Workout</h2>
                <p>
                  {dashboardData.avgCaloriesPerWorkout
                    ? dashboardData.avgCaloriesPerWorkout.toFixed(2)
                    : 0}{' '}
                  kcal
                </p>
              </div>
            </div>

            <button
              className="dashboard-button"
              onClick={() => setShowModal(true)}
            >
              Add Your Workout
            </button>

            {showModal && (
              <div
                className="modal-overlay"
                onClick={() => setShowModal(false)}
              >
                <div
                  className="modal-content"
                  onClick={e => e.stopPropagation()}
                >
                  <h2>Add Workout</h2>
                  <select value={exerciseName} onChange={handleExerciseChange}>
                    <option value="">Select Exercise</option>
                    {exerciseOptions.map((option, i) => (
                      <option key={i} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Sets"
                    value={sets}
                    onChange={handlePositiveChange(setSets)}
                  />
                  <input
                    type="number"
                    placeholder="Reps"
                    value={reps}
                    onChange={handlePositiveChange(setReps)}
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                  <select
                    value={intensity}
                    onChange={e => setIntensity(e.target.value)}
                  >
                    <option value="">Select Intensity</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={handlePositiveChange(setDuration)}
                    min="0"
                  />

                  <div>Calories: {calories}</div>
                  <button
                    className="modal-submit-button"
                    onClick={handleAddWorkout}
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

            <div className="line-chart-container">
              <h2>Calories Burned Over Time</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={calorieData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#8884d8"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="dashboard-workout-table">
              <table>
                <thead>
                  <tr>
                    <th>Exercise</th>
                    <th>Sets</th>
                    <th>Reps</th>
                    <th>Date</th>
                    <th>Intensity</th>
                    <th>Duration</th>
                    <th>Calories</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((w, idx) => (
                    <tr key={idx}>
                      <td>{w.exerciseName}</td>
                      <td>{w.sets}</td>
                      <td>{w.reps}</td>
                      <td>{new Date(w.date).toLocaleDateString()}</td>
                      <td>{w.intensity}</td>
                      <td>{w.duration}</td>
                      <td>{w.calories}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p>Login First to Access the Dashboard</p>
      )}
    </div>
  );
};

export default Dashboard;
