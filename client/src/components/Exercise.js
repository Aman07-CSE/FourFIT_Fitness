import React, { useState, useEffect } from 'react';
import '../styles/Exercise.css';
import axios from 'axios';

const Exercise = () => {
  const [user, setUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [focus, setFocus] = useState('');
  const [training, setTraining] = useState('');
  const [equipment, setEquipment] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get('http://localhost:5000/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const userData = res.data.user;
        setUser(userData);

        if (userData.name) setName(userData.name);
        if (userData.gender) setGender(userData.gender);
        if (userData.birth) setAge(calculateAge(userData.birth));

        if (userData.bmiEntries?.length) {
          // Latest BMI entry
          const latest = [...userData.bmiEntries].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0];
          if (latest.weight) setWeight(latest.weight.toString());
          if (latest.height) setHeight(latest.height.toString());
        }
      })
      .catch(err => console.error('Error fetching dashboard data:', err));
  }, []);

  const calculateAge = dobString => {
    const dob = new Date(dobString);
    const today = new Date();
    let a = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) a--;
    return a;
  };

  const handlePositiveChange = setter => e => {
    const value = e.target.value;
    if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
      setter(value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          time,
          difficulty,
          focus,
          training,
          equipment,
          question,
          age,
          gender,
          height,
          weight,
        }),
      });
      const data = await res.json();
      setResponse(formatResponse(data.response));
    } catch (err) {
      console.error('Error:', err);
      setResponse('<p>There was an error processing your request.</p>');
    }
  };

  const formatResponse = text => `<h2>AI Response:</h2><p>${text}</p>`;

  return (
    <div className="ExercisePlanner-container">
      <div className="image-section">
        <div className="overlay-text">
          <i>Find Your Perfect</i>
          <br />
          <i>Exercise Routine</i>
        </div>
      </div>

      {/* Input Section */}
      <div className="inputs-container">
        <form onSubmit={handleSubmit}>
          <input
            className="input-box"
            type="number"
            value={time}
            onChange={handlePositiveChange(setTime)}
            placeholder="Enter Time in min"
            required
            min="0"
          />

          <select
            className="dropdown"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            required
          >
            <option value="">Difficulty Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            className="dropdown"
            value={focus}
            onChange={e => setFocus(e.target.value)}
            required
          >
            <option value="">Body Focus</option>
            <option value="Neck">Neck</option>
            <option value="Trapezius">Trapezius</option>
            <option value="Shoulder">Shoulder</option>
            <option value="Back">Back</option>
            <option value="Erector Spinae">Erector Spinae</option>
            <option value="Biceps">Biceps</option>
            <option value="Triceps">Triceps</option>
            <option value="Forearm">Forearm</option>
            <option value="Abs">Abs</option>
            <option value="Leg">Leg</option>
            <option value="Calf">Calf</option>
            <option value="Hips">Hips</option>
            <option value="Cardio">Cardio</option>
            <option value="Full Body">Full Body</option>
          </select>

          <select
            className="dropdown"
            value={training}
            onChange={e => setTraining(e.target.value)}
            required
          >
            <option value="">Training Type</option>
            <option value="Balance">Balance</option>
            <option value="Barre">Barre</option>
            <option value="Cardiovascular">Cardiovascular</option>
            <option value="HIIT">HIIT</option>
            <option value="Kettlebell">Kettlebell</option>
            <option value="Kickboxing">Kickboxing</option>
            <option value="Low Impact">Low Impact</option>
            <option value="Mobility">Mobility</option>
            <option value="Pilates">Pilates</option>
            <option value="Plyometric">Plyometric</option>
            <option value="Pre & Postnatal">Pre & Postnatal</option>
            <option value="Strength Training">Strength Training</option>
            <option value="Stretching">Stretching</option>
            <option value="Toning">Toning</option>
            <option value="Warm Up/Cool Down">Warm Up/Cool Down</option>
            <option value="Yoga">Yoga</option>
          </select>

          <select
            className="dropdown"
            value={equipment}
            onChange={e => setEquipment(e.target.value)}
            required
          >
            <option value="">Equipment</option>
            <option value="Barbell">Barbell</option>
            <option value="Bench">Bench</option>
            <option value="Dumbbell">Dumbbell</option>
            <option value="Exercise Band">Exercise Band</option>
            <option value="Foam Roller">Foam Roller</option>
            <option value="Jump Rope">Jump Rope</option>
            <option value="Kettlebell">Kettlebell</option>
            <option value="Mat">Mat</option>
            <option value="Medicine Ball">Medicine Ball</option>
            <option value="Physio-Ball">Physio-Ball</option>
            <option value="SandBag">SandBag</option>
            <option value="Slosh Tube">Slosh Tube</option>
            <option value="Stationary Bike">Stationary Bike</option>
            <option value="Yoga Block">Yoga Block</option>
          </select>

          <input
            className="input-box"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask me your Query"
            required
          />

          <button className="submit-button">Submit</button>
        </form>
      </div>

      <div className="ready">
        <h1>
          <i>You're ready! Let's crush this workout!</i>
        </h1>
      </div>

      {/* Response Section */}
      <div className="exercise-response">
        <div
          id="responseBox"
          className="box"
          dangerouslySetInnerHTML={{ __html: response }}
        ></div>
      </div>
    </div>
  );
};

export default Exercise;
