import '../styles/Bodyscore.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [bodyData, setBodyData] = useState([]);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [date, setDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [bodyscore, setBodyscore] = useState('');
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');

  /** Allow only positive numbers or empty input */
  const handlePositiveChange = (setter) => (e) => {
    const val = e.target.value;
    if (val === '' || /^[+]?\d+(\.\d+)?$/.test(val)) setter(val);
  };

  /** Fetch dashboard & user data once */
  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const u = data.user;
        setUser(u);
        if (u.name) setName(u.name);
        if (u.gender) setGender(u.gender);
        if (u.bodyEntries) setBodyData(u.bodyEntries);

        // Pre-fill last weight/height
        if (u.bmiEntries?.length) {
          const last = [...u.bmiEntries].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          )[0];
          setWeight(last.weight.toString());
          setHeight(last.height.toString());
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboard();
  }, []);

  /** Add new body entry */
  const handleAddBodyEntry = async () => {
    if (!date || !weight || !height || !waist || !neck ||
        bodyFat === '' || muscleMass === '' || bodyscore === '') {
      alert('Please fill all fields.');
      return;
    }

    const entry = {
      date,
      weight,
      height,
      waist,
      hip,
      neck,
      bodyFat: parseFloat(bodyFat),
      muscleMass: parseFloat(muscleMass),
      bodyscore: parseFloat(bodyscore)
    };

    try {
      await axios.post('http://localhost:5000/api/body/add', entry, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBodyData((prev) => [...prev, entry]);
      // Reset only modal fields
      setDate('');
      setWaist('');
      setHip('');
      setNeck('');
      setBodyFat('');
      setMuscleMass('');
      setBodyscore('');
      setShowModal(false);
    } catch (err) {
      console.error('Error adding Bodydata entry:', err);
    }
  };

  /** Auto-calculate Body Fat, Muscle Mass, and Body Score */
  useEffect(() => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);
    const wt = parseFloat(weight);

    if (!gender || !h || !n || !w || !wt || (gender === 'Female' && !hp)) {
      setBodyFat('');
      setMuscleMass('');
      setBodyscore('');
      return;
    }

    let bf;
    if (gender === 'Male') {
      const diff = w - n;
      if (diff <= 0) return;
      bf = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(h)) - 450;
    } else {
      const sum = w + hp - n;
      if (sum <= 0) return;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(sum) + 0.22100 * Math.log10(h)) - 450;
    }

    if (!isFinite(bf)) {
      setBodyFat('');
      setMuscleMass('');
      setBodyscore('');
      return;
    }

    const roundedBF = +bf.toFixed(2);
    const leanMass = wt * (1 - roundedBF / 100);
    const estMuscle = +(leanMass * 0.5).toFixed(2);
    const score = Math.round(estMuscle * 2 - roundedBF);

    setBodyFat(roundedBF);
    setMuscleMass(estMuscle);
    setBodyscore(score);
  }, [waist, neck, hip, weight, height, gender]);

  /** Prepare chart data (sorted) */
  const bodyChartData = [...bodyData]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => ({
      date: new Date(e.date).toLocaleDateString('en-CA'),
      bodyscore: e.bodyscore,
      bodyFat: e.bodyFat
    }));

  const lastBody = bodyData[bodyData.length - 1] || {};

  return (
    <div className="dashboard-main-container">
      {user ? (
        <>
          <h1 className="dashboard-h1">Hi, {name}</h1>
          <h1 className="dashboard-h1"><span>Your Body Weight & BMI</span></h1>

          <div className="dashboard-cards">
            <div className="dashboard-card">
              <h2>Current Body Fat</h2>
              <p>{lastBody.bodyFat ?? '--'} %</p>
            </div>
            <div className="dashboard-card">
              <h2>Current Muscle Mass</h2>
              <p>{lastBody.muscleMass ?? '--'} %</p>
            </div>
            <div className="dashboard-card">
              <h2>Current Body Score</h2>
              <p>{lastBody.bodyscore ?? '--'}</p>
            </div>
          </div>

          <button className="dashboard-button" onClick={() => setShowModal(true)}>
            Add Entry
          </button>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add Entry</h2>
                <input type="number" placeholder="Neck (cm)" value={neck}
                  onChange={handlePositiveChange(setNeck)} required />
                <input type="number" placeholder="Waist (cm)" value={waist}
                  onChange={handlePositiveChange(setWaist)} required />
                {gender === 'Female' && (
                  <input type="number" placeholder="Hip (cm)" value={hip}
                    onChange={handlePositiveChange(setHip)} required />
                )}
                <input type="date" value={date}
                  onChange={(e) => setDate(e.target.value)} required />
                <div>
                  Body Fat: {bodyFat}% &emsp;
                  Muscle Mass: {muscleMass}% &emsp;
                  Body Score: {bodyscore}
                </div>
                <button className="modal-submit-button" onClick={handleAddBodyEntry}>
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="charts-container">
            <div className="chart-wrapper">
              <h2>Body Score over Time</h2>
              {bodyChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bodyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="bodyscore" stroke="#82ca9d" name="Body Score" activeDot={{ r: 8 }}/>
                  </LineChart>
                </ResponsiveContainer>
              ) : <p>No data available for chart.</p>}
            </div>

            <div className="chart-wrapper">
              <h2>Body Fat over Time</h2>
              {bodyChartData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={bodyChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(val) => `${val}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="bodyFat" stroke="#8884d8" name="Body Fat (%)" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p>No data available for chart.</p>}
            </div>
          </div>

          {/* Table */}
          <div className="dashboard-workout-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th><th>Weight (kg)</th><th>Height (cm)</th>
                  <th>Waist (cm)</th><th>Neck (cm)</th>
                  <th>Body Fat (%)</th><th>Muscle Mass (%)</th><th>Bodyscore</th>
                </tr>
              </thead>
              <tbody>
                {bodyData.map((e, i) => (
                  <tr key={i}>
                    <td>{new Date(e.date).toLocaleDateString()}</td>
                    <td>{e.weight}</td>
                    <td>{e.height}</td>
                    <td>{e.waist}</td>
                    <td>{e.neck}</td>
                    <td>{e.bodyFat}</td>
                    <td>{e.muscleMass}</td>
                    <td>{e.bodyscore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Login first to access the Dashboard</p>
      )}
    </div>
  );
};

export default Dashboard;
