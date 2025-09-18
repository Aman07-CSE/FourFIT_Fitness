import '../styles/Profile.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [bmiData, setBmiData] = useState([]);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [date, setDate] = useState('');
    const [bmi, setBmi] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const handlePositiveChange = (setter) => (e) => {
        const value = e.target.value;
        if (value === '' || /^[+]?\d+(\.\d+)?$/.test(value)) {
            setter(value);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            
            axios.get('http://localhost:5000/api/dashboard', {
                
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                setUser(res.data.user);
                // If BMI entries exist in user object
                if (res.data.user.bmiEntries) {
                    setBmiData(res.data.user.bmiEntries);
                }
            })
            .catch(err => console.log('Error fetching dashboard data:', err));
        }
    }, []);

    useEffect(() => {
        const weightKg = parseFloat(weight);
        const heightM = parseFloat(height) / 100; // convert cm to meters
        if (!isNaN(weightKg) && !isNaN(heightM) && heightM > 0) {
            const calculatedBmi = weightKg / (heightM * heightM);
            setBmi(calculatedBmi.toFixed(2));
        } else {
            setBmi(0);
        }
    }, [weight, height]);

    //
    const getBmiClassification = (bmi) => {
        if (bmi < 16) return "Severe Thinness";
        if (bmi < 17) return "Moderate Thinness";
        if (bmi < 18.5) return "Mild Thinness";
        if (bmi < 25) return "Normal";
        if (bmi < 30) return "Overweight";
        if (bmi < 35) return "Obese Class I";
        if (bmi < 40) return "Obese Class II";
        return "Obese Class III";
    };
    //
    const handleAddBmiEntry = () => {
        const entry = { weight, height, date, bmi: parseFloat(bmi) };

        axios.post('http://localhost:5000/api/bmi/add', entry, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => {
            setBmiData(prev => [...prev, entry]);
            setWeight('');
            setHeight('');
            setDate('');
            setBmi(0);
            setShowModal(false);
        })
        .catch(err => console.log('Error adding BMI entry:', err));
    };

    const bmiChartData = bmiData.map(entry => ({
        date: new Date(entry.date).toLocaleDateString(),
        weight: entry.weight
    }));
    const lastWeight = bmiData.length > 0 ? bmiData[bmiData.length - 1].weight : null;
    const lastBmi = bmiData.length > 0 ? bmiData[bmiData.length - 1].bmi : null;
    const maxWeight = bmiData.length > 0
    ? Math.max(...bmiData.map(entry => parseFloat(entry.weight)))
    : null;

    return (
        <div className="dashboard-main-container">
            {user ? (
                <>
                    <h1 className="dashboard-h1">Hi, {user.name}</h1>
                    <h1 className="dashboard-h1"><span>Your Body Weight & BMI</span></h1>
                    
                    <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h2>current Weight</h2>
                                <p>{lastWeight} Kg</p>
                                
                            </div>

                            <div className="dashboard-card">
                                <h2>Current BMI</h2>
                                <p>{lastBmi}</p>
                            </div>

                            <div className="dashboard-card">
                                <h2>Highest Weight you scored</h2>
                                <p>{maxWeight} Kg</p>
                            </div>
                    </div>
                
                    <button className="dashboard-button" onClick={() => setShowModal(true)}>
                        Add Weight Entry
                    </button>

                    {showModal && (
                        <div className="modal-overlay" onClick={() => setShowModal(false)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <h2>Add BMI Entry</h2>
                                <input
                                    type="number"
                                    placeholder="Weight in kg"
                                    value={weight}
                                    onChange={handlePositiveChange(setWeight)}
                                />
                                <input
                                    type="number"
                                    placeholder="Height in cm"
                                    value={height}
                                    onChange={handlePositiveChange(setHeight)}
                                />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <div>BMI: {bmi}</div>
                                <button className="modal-submit-button" onClick={handleAddBmiEntry}>Submit</button>
                            </div>
                        </div>
                    )}

                    <div className="line-chart-container">
                        <h2>Weight Over Time</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={bmiChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[10, 40]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="weight" stroke="#82ca9d" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="dashboard-workout-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Weight (kg)</th>
                                    <th>Height (cm)</th>
                                    <th>BMI</th>
                                    <th>Classification</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bmiData.map((entry, index) => (
                                    <tr key={index}>
                                        <td>{new Date(entry.date).toLocaleDateString()}</td>
                                        <td>{entry.weight} Kg</td>
                                        <td>{entry.height} cm</td>
                                        <td>{entry.bmi}</td>
                                        <td>{entry.classification || getBmiClassification(entry.bmi)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <p>Login First to Access the Dashboard</p>
            )}
        </div>
    );
};

export default Dashboard;
