import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Prediction.css';

function Prediction() {
  const location = useLocation();
  const navigate = useNavigate();
  const [finalScores, setFinalScores] = useState({ home: 0, away: 0 });
  const [currentScores, setCurrentScores] = useState({ home: 0, away: 0 });
  const [description, setDescription] = useState('');
  const [goalEvents, setGoalEvents] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedGoals, setDisplayedGoals] = useState([]);

  useEffect(() => {
    if (!location.state) {
      navigate('/classic-match');
      return;
    }

    const { prediction } = location.state;
    extractPrediction(prediction);
  }, [location.state, navigate]);

  const extractPrediction = (predictionText) => {
    const scoreMatch = predictionText.match(/Score:\s*(\d+)\s*[-–—]\s*(\d+)/i);
    const homeGoalsMatch = predictionText.match(/Home Goals:\s*([\d,\s]*)/i);
    const awayGoalsMatch = predictionText.match(/Away Goals:\s*([\d,\s]*)/i);
    const descMatch = predictionText.match(/Description:\s*(.+)/is);

    let homeScore = 0;
    let awayScore = 0;
    const goals = [];

    if (scoreMatch) {
      homeScore = parseInt(scoreMatch[1]);
      awayScore = parseInt(scoreMatch[2]);
    }

    setFinalScores({ home: homeScore, away: awayScore });

    // Parse goal minutes
    if (homeGoalsMatch && homeGoalsMatch[1].trim()) {
      const minutes = homeGoalsMatch[1].split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
      minutes.forEach(min => goals.push({ minute: min, team: 'home' }));
    }

    if (awayGoalsMatch && awayGoalsMatch[1].trim()) {
      const minutes = awayGoalsMatch[1].split(',').map(m => parseInt(m.trim())).filter(m => !isNaN(m));
      minutes.forEach(min => goals.push({ minute: min, team: 'away' }));
    }

    // Sort goals by minute
    goals.sort((a, b) => a.minute - b.minute);
    setGoalEvents(goals);

    if (descMatch) {
      setDescription(descMatch[1].trim());
    } else {
      setDescription(predictionText);
    }

    // Start animation
    setIsAnimating(true);
  };

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= 90) {
          setIsAnimating(false);
          clearInterval(interval);
          return 90;
        }
        return prev + 1;
      });
    }, 100); // 100ms per game minute = 9 seconds total animation

    return () => clearInterval(interval);
  }, [isAnimating]);

  useEffect(() => {
    // Check for goals at current timer minute
    const newGoals = goalEvents.filter(g => g.minute === timer);

    if (newGoals.length > 0) {
      newGoals.forEach(goal => {
        setDisplayedGoals(prev => [...prev, goal]);
        setCurrentScores(prev => ({
          ...prev,
          [goal.team]: prev[goal.team] + 1
        }));
      });
    }
  }, [timer, goalEvents]);

  if (!location.state) return null;

  const { homeTeam, awayTeam } = location.state;

  return (
    <div className="prediction-container">
      <h1 className="prediction-page-title">MATCH PREDICTION</h1>

      <div className="match-display-area">
        {/* Home Team */}
        <div className="team-score-panel">
          <img
            src={homeTeam.logo}
            alt={homeTeam.team}
            className="team-score-logo"
          />
          <h2 className="team-score-name">{homeTeam.team}</h2>
          <div className="score-box">{currentScores.home}</div>
        </div>

        {/* Central Timeline */}
        <div className="timeline-container">
          <div className="timer-display">
            <span className="timer-value">{timer}'</span>
          </div>

          <div className="timeline-track">
            {displayedGoals.map((goal, index) => (
              <div
                key={index}
                className={`goal-event ${goal.team === 'home' ? 'goal-home' : 'goal-away'}`}
                style={{ top: `${(goal.minute / 90) * 100}%` }}
              >
                <span className="goal-text">GOAL {goal.minute}"</span>
                <div className="goal-marker"></div>
              </div>
            ))}
            <div
              className="timeline-progress"
              style={{ height: `${(timer / 90) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Away Team */}
        <div className="team-score-panel">
          <img
            src={awayTeam.logo}
            alt={awayTeam.team}
            className="team-score-logo"
          />
          <h2 className="team-score-name">{awayTeam.team}</h2>
          <div className="score-box">{currentScores.away}</div>
        </div>
      </div>

      {/* Match Description - Only show after match ends */}
      {!isAnimating && timer >= 90 && description && (
        <div className="prediction-details fade-in">
          <h3 className="prediction-details-title">Match Summary</h3>
          <div className="prediction-details-content">
            <p>{description}</p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/classic-match')}>
        ← Back to Team Selection
      </button>
    </div>
  );
}

export default Prediction;
