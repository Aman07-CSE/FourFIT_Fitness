import React, { useState, useEffect, useRef } from 'react';
import '../styles/Chatbot.css';
import axios from 'axios';

const Chatbot = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  const chatbotRef = useRef(null);

  // --- Fetch user data on mount (fixed: no async directly in useEffect) ---
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const userData = res.data.user;
        setUser(userData);

        if (userData.name) setName(userData.name);
        if (userData.gender) setGender(userData.gender);
        if (userData.birth) setAge(calculateAge(userData.birth));

        if (userData.bmiEntries?.length) {
          const lastEntry = [...userData.bmiEntries]
            .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
          if (lastEntry.weight) setWeight(String(lastEntry.weight));
          if (lastEntry.height) setHeight(String(lastEntry.height));
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };

    fetchUser();
  }, []);

  // --- Helpers ---
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let calculated = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) calculated--;
    return calculated;
  };

  const handleNumberChange = (setter) => (e) => setter(e.target.value);

  // --- Submit user question ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_CHATBOT_URL || 'http://localhost:5001'}/api/chatbot`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            gender,
            age: Number(age),
            height: Number(height),
            weight: Number(weight),
            question,
          }),
        }
      );

      const data = await res.json();
      setResponse(data.response || 'No response received.');
      setShowInput(false);
    } catch (error) {
      console.error('Error sending question:', error);
      setResponse('There was an error processing your request.');
      setShowInput(false);
    }
  };

  const handleNextQuestion = () => {
    setShowInput(true);
    setQuestion('');
    setResponse('');
  };

  // --- Close chatbot when clicking outside ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsChatbotOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCloseChatbot = () => setIsChatbotOpen(false);

  return (
    <div>
      <div
        className={`chatbot-container ${isChatbotOpen ? 'active' : ''}`}
        ref={chatbotRef}
      >
        <div className="chat-input">
          {showInput ? (
            <form onSubmit={handleSubmit}>
              {/* If user is already fetched, skip personal info inputs */}
              {!user && (
                <>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <input
                    type="number"
                    value={age}
                    onChange={handleNumberChange(setAge)}
                    placeholder="Enter your age"
                    required
                  />
                  <input
                    type="number"
                    value={height}
                    onChange={handleNumberChange(setHeight)}
                    placeholder="Enter your height (cm)"
                    required
                  />
                  <input
                    type="number"
                    value={weight}
                    onChange={handleNumberChange(setWeight)}
                    placeholder="Enter your weight (kg)"
                    required
                  />
                </>
              )}

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask me anything"
                required
              />

              <div className="button-container">
                <button type="submit">Send</button>
                <button type="button" onClick={handleCloseChatbot}>
                  Close
                </button>
              </div>
            </form>
          ) : (
            <div className="chat-response">
              <h2>AI Response:</h2>
              <p>{response}</p>
              <button onClick={handleNextQuestion}>Next Question</button>
            </div>
          )}
        </div>
      </div>

      {/* Toggle button when closed */}
      {!isChatbotOpen && (
        <div
          className="chatbot-toggle-btn"
          onClick={() => setIsChatbotOpen(true)}
          aria-label="Open chatbot"
        >
          <span role="img" aria-label="chat">
            💬
          </span>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
